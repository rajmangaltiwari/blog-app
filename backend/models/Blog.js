const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subTitle: {
      type: String,
      required: [true, 'Please provide a subtitle'],
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide blog description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL or upload image'],
    },
    category: {
      type: String,
      enum: ['Technology', 'Startup', 'Lifestyle', 'Finance', 'Other'],
      default: 'Other',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog must have an author'],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Blog', blogSchema);
