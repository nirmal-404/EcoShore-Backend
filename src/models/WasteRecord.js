const mongoose = require('mongoose');
const { PLASTIC_TYPES } = require('../constants/analytics.constants');
const wasteRecordSchema = new mongoose.Schema(
  {
    beachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beach',
      required: [true, 'Beach reference is required'],
      index: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
    },

    plasticType: {
      type: String,
      required: [true, 'Plastic type is required'],
      enum: Object.keys(PLASTIC_TYPES),
      index: true,
    },

    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0.01, 'Weight must be at least 0.01 kg'],
      max: [10000, 'Weight cannot exceed 10000 kg'],
    },

    // Source categorization for analytics
    source: {
      type: String,
      enum: ['CLEANUP_EVENT', 'INDIVIDUAL', 'COMMUNITY_DRIVE', 'CORPORATE'],
      default: 'CLEANUP_EVENT',
      index: true,
    },

    // Weather conditions at time of collection
    weather: {
      condition: {
        type: String,
        enum: ['SUNNY', 'CLOUDY', 'RAINY', 'WINDY', 'OTHER'],
      },
      temperature: Number, // Celsius
      windSpeed: Number, // km/h
    },

    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
      default: Date.now,
      index: true,
    },

    // Calculated carbon offset (denormalized for performance)
    carbonOffset: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Metadata
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==========================================
// INDEXES - Critical for analytics performance
// ==========================================

// Compound index for time-series analytics (most frequent query pattern)
wasteRecordSchema.index({ beachId: 1, collectionDate: -1 });

// Index for plastic type analytics
wasteRecordSchema.index({ plasticType: 1, collectionDate: -1 });

// Index for carbon offset calculations
wasteRecordSchema.index({ collectionDate: -1, carbonOffset: 1 });

// Index for verification status and date range
wasteRecordSchema.index({ isVerified: 1, collectionDate: -1 });

// Compound index for trend analysis (beach + plastic type + date)
wasteRecordSchema.index({
  beachId: 1,
  plasticType: 1,
  collectionDate: -1,
});

// ==========================================
// PRE-SAVE HOOKS
// ==========================================

/**
 * Calculate carbon offset before saving
 * Uses configurable emission factor (injected from service)
 */
wasteRecordSchema.pre('save', async function (next) {
  if (this.isModified('weight') || this.isModified('plasticType')) {
    try {
      // Get carbon config - will be set by service layer
      const CarbonConfig = mongoose.model('CarbonConfig');
      const config = await CarbonConfig.getActiveConfig();

      const emissionFactor = config?.emissionFactor || 2.5; // Default fallback

      // Plastic type impact multiplier
      const plasticMultiplier = PLASTIC_TYPES[this.plasticType]?.weight || 1.0;

      // Carbon offset = weight * emissionFactor * plasticMultiplier
      this.carbonOffset = this.weight * emissionFactor * plasticMultiplier;
    } catch (error) {
      // If config not found, use default
      this.carbonOffset =
        this.weight * 2.5 * (PLASTIC_TYPES[this.plasticType]?.weight || 1.0);
    }
  }
  next();
});

/**
 * After save, update beach analytics
 */
wasteRecordSchema.post('save', async function (doc) {
  try {
    const Beach = mongoose.model('Beach');
    await Beach.findByIdAndUpdate(doc.beachId, {
      $inc: {
        'analytics.totalWasteCollected': doc.weight,
        'analytics.totalCleanups': 1,
      },
      $set: {
        'analytics.lastCleanupDate': doc.collectionDate,
      },
    });
  } catch (error) {
    console.error('Failed to update beach analytics:', error);
  }
});

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);
