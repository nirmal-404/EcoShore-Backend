const CommunityContent = require('../models/CommunityContent');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');
const { validateObjectId } = require('../utils/validators');

/**
 * CommunityContentService (SOLID - Single Responsibility)
 * Handles business logic for community posts and comments
 */
class CommunityContentService {
  /**
   * Create a post
   */
  async createPost(authorId, postData) {
    validateObjectId(authorId, 'Author ID');

    const { text, mediaUrls, visibility } = postData;

    const post = await CommunityContent.create({
      authorId,
      contentType: 'POST',
      text,
      mediaUrls: mediaUrls || [],
      visibility: visibility || 'AUTHENTICATED',
    });

    return await CommunityContent.findById(post._id)
      .populate('authorId', 'name email')
      .lean();
  }

  /**
   * Create a comment
   */
  async createComment(authorId, postId, commentData) {
    validateObjectId(authorId, 'Author ID');
    validateObjectId(postId, 'Post ID');

    const { text } = commentData;

    // Verify parent post exists
    const parentPost = await CommunityContent.findOne({
      _id: postId,
      contentType: 'POST',
      isDeleted: false,
    });

    if (!parentPost) {
      throw new AppError('Post not found', 404);
    }

    const session = await CommunityContent.startSession();
    session.startTransaction();

    try {
      // Create comment
      const comment = await CommunityContent.create(
        [
          {
            authorId,
            contentType: 'COMMENT',
            parentId: postId,
            text,
            visibility: parentPost.visibility,
          },
        ],
        { session }
      );

      // Increment parent's comment count
      await CommunityContent.findByIdAndUpdate(
        postId,
        { $inc: { commentsCount: 1 } },
        { session }
      );

      await session.commitTransaction();

      return await CommunityContent.findById(comment[0]._id)
        .populate('authorId', 'name email')
        .lean();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get posts with pagination and visibility filtering
   */
  async getPosts(userId = null, filters = {}, page = 1, limit = 10) {
    const query = {
      contentType: 'POST',
      isDeleted: false,
    };

    // Visibility filtering
    if (userId) {
      // Authenticated user: show all AUTHENTICATED and PUBLIC posts
      query.visibility = { $in: ['PUBLIC', 'AUTHENTICATED'] };
    } else {
      // Guest: show only PUBLIC posts
      query.visibility = 'PUBLIC';
    }

    // Filter by author
    if (filters.authorId) {
      validateObjectId(filters.authorId, 'Author ID');
      query.authorId = filters.authorId;
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      CommunityContent.find(query)
        .populate('authorId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityContent.countDocuments(query),
    ]);

    return {
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  /**
   * Get post by ID
   */
  async getPostById(postId, userId = null) {
    validateObjectId(postId, 'Post ID');

    const query = {
      _id: postId,
      contentType: 'POST',
      isDeleted: false,
    };

    // Visibility check
    if (!userId) {
      query.visibility = 'PUBLIC';
    }

    const post = await CommunityContent.findOne(query)
      .populate('authorId', 'name email role')
      .lean();

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  /**
   * Get comments for a post
   */
  async getComments(postId, userId = null, page = 1, limit = 20) {
    validateObjectId(postId, 'Post ID');

    // Verify post exists and user can access it
    await this.getPostById(postId, userId);

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      CommunityContent.find({
        parentId: postId,
        contentType: 'COMMENT',
        isDeleted: false,
      })
        .populate('authorId', 'name email')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityContent.countDocuments({
        parentId: postId,
        contentType: 'COMMENT',
        isDeleted: false,
      }),
    ]);

    return {
      comments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  /**
   * Like a post
   * Business Rule: Prevent duplicate likes
   */
  async likePost(postId, userId) {
    validateObjectId(postId, 'Post ID');
    validateObjectId(userId, 'User ID');

    const post = await CommunityContent.findOne({
      _id: postId,
      contentType: 'POST',
      isDeleted: false,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check if already liked
    if (post.likes.some((like) => like.toString() === userId)) {
      throw new AppError('You have already liked this post', 400);
    }

    post.likes.push(userId);
    post.likesCount = post.likes.length;
    await post.save();

    return { message: 'Post liked successfully', likesCount: post.likesCount };
  }

  /**
   * Unlike a post
   */
  async unlikePost(postId, userId) {
    validateObjectId(postId, 'Post ID');
    validateObjectId(userId, 'User ID');

    const post = await CommunityContent.findOne({
      _id: postId,
      contentType: 'POST',
      isDeleted: false,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check if liked
    if (!post.likes.some((like) => like.toString() === userId)) {
      throw new AppError('You have not liked this post', 400);
    }

    post.likes = post.likes.filter((like) => like.toString() !== userId);
    post.likesCount = post.likes.length;
    await post.save();

    return {
      message: 'Post unliked successfully',
      likesCount: post.likesCount,
    };
  }

  /**
   * Share a post
   */
  async sharePost(postId, userId) {
    validateObjectId(postId, 'Post ID');
    validateObjectId(userId, 'User ID');

    const post = await CommunityContent.findOneAndUpdate(
      {
        _id: postId,
        contentType: 'POST',
        isDeleted: false,
      },
      { $inc: { sharesCount: 1 } },
      { new: true }
    );

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return {
      message: 'Post shared successfully',
      sharesCount: post.sharesCount,
    };
  }

  /**
   * Update post
   */
  async updatePost(postId, userId, updateData) {
    validateObjectId(postId, 'Post ID');
    validateObjectId(userId, 'User ID');

    const post = await CommunityContent.findOne({
      _id: postId,
      contentType: 'POST',
      isDeleted: false,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.authorId.toString() !== userId) {
      throw new AppError('Unauthorized to update this post', 403);
    }

    // Update fields
    if (updateData.text !== undefined) post.text = updateData.text;
    if (updateData.mediaUrls !== undefined)
      post.mediaUrls = updateData.mediaUrls;
    if (updateData.visibility !== undefined)
      post.visibility = updateData.visibility;

    await post.save();

    return await CommunityContent.findById(postId)
      .populate('authorId', 'name email')
      .lean();
  }

  /**
   * Soft delete post or comment
   */
  async deleteContent(contentId, userId) {
    validateObjectId(contentId, 'Content ID');
    validateObjectId(userId, 'User ID');

    const content = await CommunityContent.findOne({
      _id: contentId,
      isDeleted: false,
    });

    if (!content) {
      throw new AppError('Content not found', 404);
    }

    if (content.authorId.toString() !== userId) {
      throw new AppError('Unauthorized to delete this content', 403);
    }

    const session = await CommunityContent.startSession();
    session.startTransaction();

    try {
      // Soft delete content
      content.isDeleted = true;
      content.deletedAt = new Date();
      await content.save({ session });

      // If deleting a comment, decrement parent's comment count
      if (content.contentType === 'COMMENT' && content.parentId) {
        await CommunityContent.findByIdAndUpdate(
          content.parentId,
          { $inc: { commentsCount: -1 } },
          { session }
        );
      }

      await session.commitTransaction();

      return { message: 'Content deleted successfully' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new CommunityContentService();
