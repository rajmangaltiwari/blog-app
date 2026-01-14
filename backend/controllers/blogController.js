const Blog = require('../models/Blog');
const User = require('../models/User');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, subTitle, description, image, category } = req.body;

    // Validation
    if (!title || !subTitle || !description || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, subTitle, description, and image',
      });
    }

    // Validate userId exists
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Create blog with author ID from auth middleware
    const blog = await Blog.create({
      title,
      subTitle,
      description,
      image,
      category: category || 'Other',
      author: req.userId, // Set by protect middleware in auth
      isPublished: true,
    });

    // Populate author details
    const populatedBlog = await blog.populate('author', 'name avatar email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: populatedBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating blog',
      error: error.message,
    });
  }
};

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query;

    // Build filter
    let filter = { isPublished: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blogs',
    });
  }
};

// Get a single blog by ID
exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('author', 'name avatar email bio')
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blog',
    });
  }
};

// Get user's own blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId })
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user blogs',
    });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, description, image, category, isPublished } = req.body;

    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog',
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (subTitle) blog.subTitle = subTitle;
    if (description) blog.description = description;
    if (image) blog.image = image;
    if (category) blog.category = category;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    blog = await blog.save();
    await blog.populate('author', 'name avatar email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating blog',
    });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting blog',
    });
  }
};
