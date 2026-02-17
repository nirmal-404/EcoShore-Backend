const express = require('express');
const communityContentController = require('../controller/communityContent.controller');
const requireAuth = require('../middleware/requireAuth');
const authOptional = require('../middleware/authOptional');
const validate = require('../middleware/validate');
const {
  createPostSchema,
  createCommentSchema,
  updatePostSchema,
} = require('../validation/communityContent.validation');

const router = express.Router();

/**
 * @route   POST /community/posts
 * @desc    Create a post
 * @access  Private
 */
router.post(
  '/posts',
  requireAuth,
  validate(createPostSchema),
  communityContentController.createPost
);

/**
 * @route   GET /community/posts
 * @desc    Get all posts (with visibility filtering)
 * @access  Public (with optional auth)
 */
router.get('/posts', authOptional, communityContentController.getPosts);

/**
 * @route   GET /community/posts/:id
 * @desc    Get post by ID
 * @access  Public (with optional auth)
 */
router.get('/posts/:id', authOptional, communityContentController.getPostById);

/**
 * @route   PATCH /community/posts/:id
 * @desc    Update post
 * @access  Private (Author only)
 */
router.patch(
  '/posts/:id',
  requireAuth,
  validate(updatePostSchema),
  communityContentController.updatePost
);

/**
 * @route   POST /community/posts/:id/comments
 * @desc    Create comment on a post
 * @access  Private
 */
router.post(
  '/posts/:id/comments',
  requireAuth,
  validate(createCommentSchema),
  communityContentController.createComment
);

/**
 * @route   GET /community/posts/:id/comments
 * @desc    Get comments for a post
 * @access  Public (with optional auth)
 */
router.get(
  '/posts/:id/comments',
  authOptional,
  communityContentController.getComments
);

/**
 * @route   POST /community/posts/:id/like
 * @desc    Like a post
 * @access  Private
 */
router.post(
  '/posts/:id/like',
  requireAuth,
  communityContentController.likePost
);

/**
 * @route   DELETE /community/posts/:id/like
 * @desc    Unlike a post
 * @access  Private
 */
router.delete(
  '/posts/:id/like',
  requireAuth,
  communityContentController.unlikePost
);

/**
 * @route   POST /community/posts/:id/share
 * @desc    Share a post
 * @access  Private
 */
router.post(
  '/posts/:id/share',
  requireAuth,
  communityContentController.sharePost
);

/**
 * @route   DELETE /community/content/:id
 * @desc    Delete post or comment
 * @access  Private (Author only)
 */
router.delete(
  '/content/:id',
  requireAuth,
  communityContentController.deleteContent
);

module.exports = router;
