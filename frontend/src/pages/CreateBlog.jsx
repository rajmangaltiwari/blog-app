import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../services/api'

const CreateBlog = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    image: '',
    category: 'Technology',
  })
  
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image URL input
  const handleImageUrl = (url) => {
    if (url.trim()) {
      setFormData(prev => ({
        ...prev,
        image: url
      }))
      setImagePreview(url)
    }
  }

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      // For large files, use a URL instead of base64
      // Or you can upload to a cloud service like Cloudinary, AWS S3, etc.
      alert('For production, use a cloud storage service like Cloudinary or AWS S3.\nFor now, please use an image URL instead.')
      document.getElementById('imageUpload').value = ''
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim() || !formData.subTitle.trim() || 
        !formData.description.trim() || !formData.image.trim()) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await blogAPI.createBlog(formData)
      
      if (response.success) {
        // Redirect to the created blog
        navigate(`/blog/${response.blog._id}`)
      } else {
        setError(response.message || 'Error creating blog')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating blog'
      setError(errorMsg)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Create Your Blog Post
          </h1>
          <p className="text-xl text-gray-600">
            Share your ideas with the world
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Title Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your blog title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg"
              maxLength="200"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Subtitle Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Subtitle
            </label>
            <input
              type="text"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Enter a short subtitle or summary"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg"
              maxLength="300"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.subTitle.length}/300 characters
            </p>
          </div>

          {/* Category Select */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg"
            >
              <option value="Technology">Technology</option>
              <option value="Startup">Startup</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Blog Image
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Tabs for Upload/URL */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => document.getElementById('imageUpload').click()}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                📁 Upload Image
              </button>
              
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image URL Input */}
            <div className="relative">
              <input
                type="url"
                placeholder="Or paste image URL here"
                onBlur={(e) => e.target.value && handleImageUrl(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Paste a URL and click outside the field to preview
              </p>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Blog Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your blog content here... (supports HTML formatting)"
              rows="12"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-lg font-mono"
            />
            <p className="text-sm text-gray-500 mt-2">
              You can use HTML tags for formatting like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, etc.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : '✨ Publish Blog'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
