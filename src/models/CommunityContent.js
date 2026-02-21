const mongoose = require('mongoose');

const CommunityContentSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentType: {
      type: String,
      enum: ['POST', 'COMMENT'],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityContent',
      // Set for comments (references parent post)
      // Null for posts
    },
    text: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    mediaUrls: [
      {
        type: String,
      },
    ],
    visibility: {
      type: String,
      enum: ['PUBLIC', 'AUTHENTICATED'],
      default: 'AUTHENTICATED',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for performance
CommunityContentSchema.index({ authorId: 1 });
CommunityContentSchema.index({ contentType: 1 });
CommunityContentSchema.index({ parentId: 1 });
CommunityContentSchema.index({ visibility: 1 });
CommunityContentSchema.index({ isDeleted: 1 });
CommunityContentSchema.index({ createdAt: -1 });

// Compound index for fetching posts
CommunityContentSchema.index({ contentType: 1, isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityContent', CommunityContentSchema);
