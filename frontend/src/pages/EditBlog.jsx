import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogAPI } from '../services/api'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    image: '',
    category: 'Other',
    isPublished: true,
  })

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const response = await blogAPI.getBlog(id)
        if (response.success) {
          setBlog(response.blog)
          setFormData({
            title: response.blog.title,
            subTitle: response.blog.subTitle,
            description: response.blog.description,
            image: response.blog.image,
            category: response.blog.category,
            isPublished: response.blog.isPublished,
          })
        }
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim() || !formData.subTitle.trim() || !formData.description.trim() || !formData.image.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await blogAPI.updateBlog(id, formData)

      if (response.success) {
        alert('Blog updated successfully!')
        navigate('/profile')
      } else {
        setError(response.message || 'Failed to update blog')
      }
    } catch (err) {
      console.error('Error updating blog:', err)
      setError(err.response?.data?.message || 'Error updating blog')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>Blog not found</p>
          <button
            onClick={() => navigate('/profile')}
            className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
          >
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-md p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Edit Blog</h1>
          <p className='text-gray-600 mb-6'>Update your blog post details</p>

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <label htmlFor='title' className='block text-gray-700 font-medium mb-2'>
                Blog Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Enter blog title'
                maxLength='200'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600'
                required
              />
              <p className='text-sm text-gray-500 mt-1'>{formData.title.length}/200</p>
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor='subTitle' className='block text-gray-700 font-medium mb-2'>
                Subtitle <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='subTitle'
                name='subTitle'
                value={formData.subTitle}
                onChange={handleInputChange}
                placeholder='Enter blog subtitle'
                maxLength='300'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600'
                required
              />
              <p className='text-sm text-gray-500 mt-1'>{formData.subTitle.length}/300</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor='description' className='block text-gray-700 font-medium mb-2'>
                Description <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Write your blog content here...'
                rows='8'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-vertical'
                required
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor='image' className='block text-gray-700 font-medium mb-2'>
                Image URL <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='image'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                placeholder='Enter image URL'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600'
                required
              />
              {formData.image && (
                <div className='mt-4'>
                  <p className='text-sm text-gray-600 mb-2'>Preview:</p>
                  <img
                    src={formData.image}
                    alt='Blog preview'
                    className='w-full h-48 object-cover rounded-lg'
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor='category' className='block text-gray-700 font-medium mb-2'>
                Category
              </label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600'
              >
                <option value='Technology'>Technology</option>
                <option value='Startup'>Startup</option>
                <option value='Lifestyle'>Lifestyle</option>
                <option value='Finance'>Finance</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Publish Status */}
            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                id='isPublished'
                name='isPublished'
                checked={formData.isPublished}
                onChange={handleInputChange}
                className='w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600'
              />
              <label htmlFor='isPublished' className='text-gray-700'>
                Publish this blog post
              </label>
            </div>

            {/* Buttons */}
            <div className='flex gap-3 pt-6 border-t border-gray-200'>
              <button
                type='submit'
                disabled={submitting}
                className='flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50'
              >
                {submitting ? 'Updating...' : 'Update Blog'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/profile')}
                className='flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditBlog
