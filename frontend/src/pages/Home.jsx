import { useState, useEffect } from 'react'
import { assets, blog_data, blogCategories } from '../assets/assets'
import { blogAPI } from '../services/api'
import BlogItem from '../components/BlogItem'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch blogs from database on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await blogAPI.getAllBlogs('All')
        
        if (response.success && response.blogs) {
          // Combine database blogs with static data (database takes priority)
          const dbBlogIds = new Set(response.blogs.map(b => b._id))
          const staticBlogs = blog_data.filter(b => !dbBlogIds.has(b._id))
          setBlogs([...response.blogs, ...staticBlogs])
        } else {
          // Fallback to static data if API fails
          setBlogs(blog_data)
        }
      } catch (err) {
        console.warn('Failed to fetch blogs from database, using static data:', err)
        // Fallback to static data
        setBlogs(blog_data)
        setError(null) // Don't show error to user, just use static data
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter blogs based on category and search term
  const filteredBlogs = blogs.filter(blog => {
    const categoryMatch = selectedCategory === 'All' || blog.category === selectedCategory
    const searchMatch = blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch && blog.isPublished !== false
  })

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-white py-16 px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          {/* New AI Feature Badge */}
          <div className='inline-block mb-6 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold'>
            ✨ New: AI feature integrated
          </div>

          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
            Your own <span className='text-indigo-600'>blogging</span> platform.
          </h1>
          <p className='text-gray-600 text-lg mb-8 max-w-2xl mx-auto'>
            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand your story starts here.
          </p>

          {/* Search Bar */}
          <div className='flex gap-2 max-w-md mx-auto'>
            <input
              type='text'
              placeholder='Search blogs'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600'
            />
            <button className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium'>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className='bg-white border-b border-gray-200 py-6 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center flex-wrap gap-3'>
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className='py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          {filteredBlogs.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
              {filteredBlogs.map((blog, index) => (
                <BlogItem 
                  key={blog._id} 
                  blog={blog}
                  isNew={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No blogs found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
