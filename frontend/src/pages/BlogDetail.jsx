import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blogAPI } from '../services/api'
import { blog_data } from '../assets/assets'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from database first
        const response = await blogAPI.getBlog(id)
        
        if (response.success) {
          setBlog(response.blog)
          // Fetch related blogs
          try {
            const allBlogs = await blogAPI.getAllBlogs(response.blog.category)
            if (allBlogs.success) {
              const related = allBlogs.blogs
                .filter(b => b._id !== id && b.category === response.blog.category)
                .slice(0, 3)
              setRelatedBlogs(related)
            }
          } catch (err) {
            console.warn('Could not fetch related blogs:', err)
          }
        }
      } catch (err) {
        console.warn('Database fetch failed, trying static data:', err)
        // Fallback to static data if database fetch fails
        const staticBlog = blog_data.find(post => post._id === id)
        if (staticBlog) {
          setBlog(staticBlog)
          const related = blog_data
            .filter(post => post.category === staticBlog.category && post._id !== id)
            .slice(0, 3)
          setRelatedBlogs(related)
        } else {
          setError('Blog not found')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading blog...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Blog Not Found</h1>
          <p className='text-gray-600 mb-8'>Sorry, the blog post you're looking for doesn't exist.</p>
          <Link to='/' className='text-indigo-600 hover:text-indigo-800 font-medium'>
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Section with Gradient Background */}
      <section className='bg-linear-to-b from-purple-100 to-pink-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Publication Date */}
          <p className='text-center text-indigo-600 text-sm font-medium mb-6'>
            Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* Title */}
          <h1 className='text-center text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
            {blog.title}
          </h1>

          {/* Subtitle */}
          <p className='text-center text-lg text-gray-600 mb-6'>
            {blog.subTitle || blog.description.substring(0, 150)}
          </p>

          {/* Author Badge */}
          <div className='flex justify-center items-center gap-3'>
            {blog.author?.avatar && (
              <img 
                src={blog.author.avatar} 
                alt={blog.author?.name}
                className='w-10 h-10 rounded-full'
              />
            )}
            <span className='inline-block px-4 py-2 bg-white border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-full'>
              {blog.author?.name || 'Anonymous'}
            </span>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className='py-8 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='rounded-2xl overflow-hidden shadow-lg'>
            <img 
              src={blog.image} 
              alt={blog.title}
              className='w-full h-96 object-cover'
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-12 px-4 bg-white'>
        <div className='max-w-4xl mx-auto'>
          {/* Blog Content */}
          <article className='prose prose-lg max-w-none mb-16'>
            <div 
              className='text-gray-700 leading-relaxed text-lg'
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </article>

          {/* Share Section */}
          <div className='border-t border-gray-200 py-8 mb-12'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>Share this article</h3>
            <div className='flex gap-4'>
              <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium'>
                Facebook
              </button>
              <button className='px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition font-medium'>
                Twitter
              </button>
              <button className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium'>
                Pinterest
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className='border-t border-gray-200 pt-12'>
              <h3 className='text-3xl font-bold text-gray-900 mb-8'>Related Articles</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    to={`/blog/${relatedBlog._id}`}
                    className='group cursor-pointer'
                  >
                    <div className='overflow-hidden rounded-lg mb-4 h-48'>
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                      />
                    </div>
                    <p className='text-sm text-indigo-600 font-semibold mb-2'>
                      {relatedBlog.category}
                    </p>
                    <h4 className='text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2'>
                      {relatedBlog.title}
                    </h4>
                    <p className='text-sm text-gray-500 mt-2'>
                      {new Date(relatedBlog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className='mt-16 pt-8 border-t border-gray-200'>
            <Link to='/' className='text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-2'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Back to all blogs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail
