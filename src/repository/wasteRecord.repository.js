const BaseRepository = require('./base.repository');
const { WasteRecord } = require('../models');
const mongoose = require('mongoose');

class WasteRecordRepository extends BaseRepository {
  constructor() {
    super(WasteRecord);
  }

  /**
   * Find waste records with complex filtering
   */
  async findByFilter(filter, sort, skip, limit) {
    return Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('beachId', 'name location.city')
        .populate('recordedBy', 'name email'),
      this.model.countDocuments(filter),
    ]);
  }

  /**
   * Get waste statistics by plastic type
   */
  async getWasteByPlasticType(
    beachId = null,
    startDate = null,
    endDate = null
  ) {
    const matchStage = { isVerified: true };

    if (beachId) matchStage.beachId = new mongoose.Types.ObjectId(beachId);
    if (startDate || endDate) {
      matchStage.collectionDate = {};
      if (startDate) matchStage.collectionDate.$gte = new Date(startDate);
      if (endDate) matchStage.collectionDate.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$plasticType',
          totalWeight: { $sum: '$weight' },
          totalCarbonOffset: { $sum: '$carbonOffset' },
          count: { $sum: 1 },
          avgWeight: { $avg: '$weight' },
        },
      },
      {
        $project: {
          plasticType: '$_id',
          totalWeight: 1,
          totalCarbonOffset: 1,
          count: 1,
          avgWeight: { $round: ['$avgWeight', 2] },
          _id: 0,
        },
      },
      { $sort: { totalWeight: -1 } },
    ];

    return this.model.aggregate(pipeline);
  }

  /**
   * Get monthly trend data for forecasting
   */
  async getMonthlyTrends(beachId = null, months = 12) {
    const matchStage = { isVerified: true };
    if (beachId) matchStage.beachId = new mongoose.Types.ObjectId(beachId);

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$collectionDate' },
            month: { $month: '$collectionDate' },
          },
          totalWeight: { $sum: '$weight' },
          recordCount: { $sum: 1 },
          avgWeight: { $avg: '$weight' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: months },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalWeight: 1,
          recordCount: 1,
          avgWeight: { $round: ['$avgWeight', 2] },
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1,
            },
          },
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  /**
   * Get carbon offset summary
   */
  async getCarbonOffsetSummary(matchStage) {
    return await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCarbonOffset: { $sum: '$carbonOffset' },
          totalWasteWeight: { $sum: '$weight' },
          averageCarbonPerKg: {
            $avg: { $divide: ['$carbonOffset', '$weight'] },
          },
          recordCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCarbonOffset: 1,
          totalWasteWeight: 1,
          averageCarbonPerKg: { $round: ['$averageCarbonPerKg', 2] },
          recordCount: 1,
        },
      },
    ]);
  }
}

module.exports = new WasteRecordRepository();
