const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const auth = require('../../middleware/auth');

// @route   POST api/posts
// @desc    Create a post
// @access  Private

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error!');
    }
  }
);
// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error!');
  }
});
// @route   GET api/posts/:post_id
// @desc    Get all posts
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error!');
  }
});
// @route   DELETE api/posts/:post_id
// @desc    Delete post by ID
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post was removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error!');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private

router.put('/like/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);

    res.status(500).send('Server error!');
  }
});
// @route   PUT api/posts/unlike/:id
// @desc    unlike a post
// @access  Private

router.put('/unlike/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    const removeIndex = post.likes.map(like =>
      like.user.toString().indexOf(req.params.id)
    );

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);

    res.status(500).send('Server error!');
  }
});
// @route   POST api/posts/comment/:id
// @desc    Comment on post
// @access  Private

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error!');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(comment => comment.id === req.params.comment_id)

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments.map(comment =>
      comment.user.toString().indexOf(req.params.id)
    );

    post.comments.splice(removeIndex, 1)
    await post.save();
   
    res.json({ msg: 'Comment was removed' });
  } catch (error) {
    console.error(error.message);

    res.status(500).send('Server error!');
  }
});

module.exports = router;