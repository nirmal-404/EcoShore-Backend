const communityContentService = require('../service/communityContent.service');

class CommunityContentController {
  /**
   * Create post
   * POST /community/posts
   */
  async createPost(req, res, next) {
    try {
      const authorId = req.user.id;
      const postData = req.body;

      const post = await communityContentService.createPost(authorId, postData);

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create comment
   * POST /community/posts/:id/comments
   */
  async createComment(req, res, next) {
    try {
      const { id } = req.params;
      const authorId = req.user.id;
      const commentData = req.body;

      const comment = await communityContentService.createComment(
        authorId,
        id,
        commentData
      );

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get posts
   * GET /community/posts
   */
  async getPosts(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const { authorId, page = 1, limit = 10 } = req.query;

      const filters = {};
      if (authorId) filters.authorId = authorId;

      const result = await communityContentService.getPosts(
        userId,
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get post by ID
   * GET /community/posts/:id
   */
  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;

      const post = await communityContentService.getPostById(id, userId);

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comments for a post
   * GET /community/posts/:id/comments
   */
  async getComments(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;
      const { page = 1, limit = 20 } = req.query;

      const result = await communityContentService.getComments(
        id,
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like post
   * POST /community/posts/:id/like
   */
  async likePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await communityContentService.likePost(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unlike post
   * DELETE /community/posts/:id/like
   */
  async unlikePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await communityContentService.unlikePost(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Share post
   * POST /community/posts/:id/share
   */
  async sharePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await communityContentService.sharePost(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update post
   * PATCH /community/posts/:id
   */
  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const post = await communityContentService.updatePost(
        id,
        userId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete post or comment
   * DELETE /community/content/:id
   */
  async deleteContent(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await communityContentService.deleteContent(id, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommunityContentController();
