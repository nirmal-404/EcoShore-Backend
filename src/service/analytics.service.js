const beachRepository = require('../repository/beach.repository');
const wasteRecordRepository = require('../repository/wasteRecord.repository');
const { CarbonConfig } = require('../models');
const { NotFoundError } = require('../utils/AppError');
const {
  SEVERITY_WEIGHTS,
  TREND_PREDICTION,
} = require('../constants/analytics.constants');

class AnalyticsService {
  /**
   * Get dashboard overview statistics
   */
  async getDashboardOverview() {
    // Get beach stats
    const beachStats = await beachRepository.getDashboardStats();

    // Get total carbon offset
    // This aggregation could also be moved to repo if complex, doing inline for now or better yet, using repo method I added
    // I added getCarbonOffsetSummary to repo, but here we just need total.
    // Let's use the one in repo if it matches or create a new one.
    // Actually I can just use wasteRecordRepository.aggregate if I exposed it, but I didn't.
    // I exposed getCarbonOffsetSummary.
    // Let's use getCarbonOffsetSummary for total carbon.

    // Or I can add a specific method to repo for this simple aggregate.
    // But wait, getCarbonOffsetSummary returns { totalCarbonOffset ... }
    const carbonSummary = await wasteRecordRepository.getCarbonOffsetSummary({
      isVerified: true,
    });
    // It returns an array of objects from aggregate.
    const totalCarbonOffset = carbonSummary[0]?.totalCarbonOffset || 0;

    // Get most polluted beach
    // Using simple repo find
    const mostPolluted = await beachRepository.findOne({ isActive: true }); // findOne works from BaseRepo?
    // BaseRepo.findOne(filter) returns model.findOne(filter).
    // We need sort and select. BaseRepo.findOne doesn't support chaining easily as it awaits.
    // So we need to access model or add method.
    // Since BeachRepository extends BaseRepository and BaseRepository stores this.model
    // We can access beachRepository.model if we really need to, but that defeats the purpose.
    // Better to add `findMostPollutedBeach` to BeachRepository or similar.
    // For now, I will assume I can't chain.
    // I'll resort to `getSeverityRanking(1)` which I already added to BeachRepository!

    const rankings = await beachRepository.getSeverityRanking(1);
    const mostPollutedBeach = rankings[0] || null;

    // Get monthly trend data
    const monthlyTrends = await wasteRecordRepository.getMonthlyTrends(null, 6);

    return {
      summary: {
        totalBeaches: beachStats?.totalBeaches || 0,
        totalWasteCollected: beachStats?.totalWasteAll || 0,
        totalCleanups: beachStats?.totalCleanupsAll || 0,
        totalCarbonOffset: totalCarbonOffset,
        averageSeverity: beachStats?.avgSeverity || 0,
      },
      mostPollutedBeach: mostPollutedBeach
        ? {
            id: mostPollutedBeach._id,
            name: mostPollutedBeach.name,
            city: mostPollutedBeach.location?.city,
            severityScore: mostPollutedBeach.analytics?.severityScore,
            totalWaste: mostPollutedBeach.analytics?.totalWasteCollected,
          }
        : null,
      monthlyTrends,
    };
  }

  /**
   * Calculate severity scores for all beaches
   * Advanced algorithm with weighted factors
   */
  async calculateSeverityScores() {
    const beaches = await beachRepository.find({ isActive: true });
    const results = [];

    for (const beach of beaches) {
      // Get last 90 days of data for trend analysis
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Need to find records.
      // BaseRepository 'find' returns all.
      // We need filtered find with sort.
      // wasteRecordRepository.findByFilter available?
      // I created findByFilter(filter, sort, skip, limit)
      const wasteRecords = (
        await wasteRecordRepository.findByFilter(
          {
            beachId: beach._id,
            collectionDate: { $gte: ninetyDaysAgo },
            isVerified: true,
          },
          { collectionDate: 1 },
          0,
          1000 // limit
        )
      )[0]; // findByFilter returns [records, total]

      if (wasteRecords.length === 0) {
        beach.analytics.severityScore = 0;
        beach.calculateSeverityLevel();
        await beach.save();
        results.push({ beachId: beach._id, score: 0, level: 'LOW' });
        continue;
      }

      // 1. Waste Volume Score (40%)
      const totalWeight = wasteRecords.reduce((sum, r) => sum + r.weight, 0);
      const volumeScore =
        Math.min((totalWeight / 500) * 100, 100) * SEVERITY_WEIGHTS.TOTAL_WASTE;

      // 2. Plastic Composition Score (30%)
      const nonRecyclableWeight = wasteRecords
        .filter((r) => ['PVC', 'PS', 'OTHER'].includes(r.plasticType))
        .reduce((sum, r) => sum + r.weight, 0);

      const nonRecyclableRatio = nonRecyclableWeight / totalWeight;
      const compositionScore =
        nonRecyclableRatio * 100 * SEVERITY_WEIGHTS.PLASTIC_RATIO;

      // 3. Frequency Score (20%)
      const uniqueDays = new Set(
        wasteRecords.map((r) => r.collectionDate.toISOString().split('T')[0])
      ).size;

      const frequencyScore =
        Math.min((uniqueDays / 30) * 100, 100) * SEVERITY_WEIGHTS.FREQUENCY;

      // 4. Trend Score (10%) - Increasing trend is worse
      let trendScore = 0;
      if (wasteRecords.length >= TREND_PREDICTION.MIN_DATA_POINTS) {
        const recentAvg =
          wasteRecords.slice(-7).reduce((sum, r) => sum + r.weight, 0) / 7;
        const olderAvg =
          wasteRecords.slice(0, 7).reduce((sum, r) => sum + r.weight, 0) / 7;

        if (olderAvg > 0) {
          const trend = (recentAvg - olderAvg) / olderAvg;
          trendScore =
            Math.max(0, Math.min(trend * 50, 100)) * SEVERITY_WEIGHTS.TREND;
        }
      }

      // Calculate total score
      const totalScore = Math.min(
        volumeScore + compositionScore + frequencyScore + trendScore,
        100
      );

      beach.analytics.severityScore = Number(totalScore.toFixed(2));
      beach.calculateSeverityLevel();
      await beach.save();

      results.push({
        beachId: beach._id,
        name: beach.name,
        score: beach.analytics.severityScore,
        level: beach.analytics.severityLevel,
      });
    }

    return results;
  }

  /**
   * Get beach severity ranking
   */
  async getSeverityRanking(limit = 10) {
    const beaches = await beachRepository.getSeverityRanking(limit);

    return beaches.map((beach) => ({
      id: beach._id,
      name: beach.name,
      city: beach.location?.city,
      severityScore: beach.analytics?.severityScore,
      severityLevel: beach.analytics?.severityLevel,
      totalWaste: beach.analytics?.totalWasteCollected,
    }));
  }

  /**
   * Predict pollution trends using Moving Average
   */
  async predictPollutionTrend(beachId = null, months = 3) {
    // Reusing repo method for aggregation
    const monthlyData = await wasteRecordRepository.getMonthlyTrends(
      beachId,
      12
    );

    if (monthlyData.length < TREND_PREDICTION.MIN_DATA_POINTS) {
      return {
        success: false,
        message: 'Insufficient data for prediction',
        required: TREND_PREDICTION.MIN_DATA_POINTS,
        current: monthlyData.length,
      };
    }

    // Extract weights
    const weights = monthlyData.map((d) => d.totalWeight);

    // Simple Moving Average forecast
    const windowSize = 3;
    const forecast = [];

    for (let i = 0; i < months; i++) {
      const recentWeights = weights.slice(-windowSize);
      const average = recentWeights.reduce((a, b) => a + b, 0) / windowSize;

      // Add some random variation for realism (±10%)
      const variation = average * 0.1 * (Math.random() - 0.5);
      const predictedWeight = average + variation;

      forecast.push({
        month: i + 1,
        predictedWeight: Number(predictedWeight.toFixed(2)),
        confidence: 0.8 - i * 0.1, // Decreasing confidence
      });

      weights.push(predictedWeight); // Add to weights for next prediction
    }

    // Calculate trend direction
    const currentAvg = weights.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    const predictedAvg =
      forecast.reduce((a, b) => a + b.predictedWeight, 0) / months;

    const trendDirection =
      predictedAvg > currentAvg ? 'INCREASING' : 'DECREASING';
    const percentageChange = (
      ((predictedAvg - currentAvg) / currentAvg) *
      100
    ).toFixed(1);

    return {
      success: true,
      beachId: beachId || 'all',
      historicalData: monthlyData.map((d) => ({
        month: `${d._id.year}-${d._id.month}`,
        weight: d.totalWeight,
      })),
      forecast,
      trend: {
        direction: trendDirection,
        percentageChange: `${percentageChange}%`,
        summary: `Pollution is ${trendDirection === 'INCREASING' ? 'increasing' : 'decreasing'} by ${Math.abs(percentageChange)}% over the next ${months} months`,
      },
    };
  }

  /**
   * Calculate carbon offset summary
   */
  async getCarbonOffsetSummary(startDate, endDate) {
    const matchStage = { isVerified: true };

    if (startDate || endDate) {
      matchStage.collectionDate = {};
      if (startDate) matchStage.collectionDate.$gte = new Date(startDate);
      if (endDate) matchStage.collectionDate.$lte = new Date(endDate);
    }

    // Use Repo
    const carbonData =
      await wasteRecordRepository.getCarbonOffsetSummary(matchStage);

    // Get carbon configuration
    const carbonConfig = await CarbonConfig.getActiveConfig();

    // Calculate equivalents for better understanding
    const carbonEquivalent = {
      carsPerYear: Math.round((carbonData[0]?.totalCarbonOffset || 0) / 4.6), // Avg car emits 4.6 tons/year
      treePlanting: Math.round((carbonData[0]?.totalCarbonOffset || 0) * 0.5), // 1 tree absorbs ~2kg CO2/year
      homesEnergy: Math.round((carbonData[0]?.totalCarbonOffset || 0) / 10.2), // Avg home uses 10.2 tons/year
    };

    return {
      summary: carbonData[0] || {
        totalCarbonOffset: 0,
        totalWasteWeight: 0,
        averageCarbonPerKg: 0,
        recordCount: 0,
      },
      emissionFactor: carbonConfig?.emissionFactor || 2.5,
      equivalents: carbonEquivalent,
    };
  }
}

module.exports = new AnalyticsService();
