const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/all', getAllBlogs); // Get all published blogs

// Protected routes (require authentication) - MUST come before /:id routes
router.post('/create', protect, createBlog); // Create a new blog
router.get('/user/my-blogs', protect, getUserBlogs); // Get user's own blogs

// These routes must come AFTER specific routes to avoid matching conflicts
router.get('/:id', getBlog); // Get single blog by ID
router.put('/:id', protect, updateBlog); // Update a blog
router.delete('/:id', protect, deleteBlog); // Delete a blog

module.exports = router;
