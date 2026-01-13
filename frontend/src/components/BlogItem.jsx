import { assets } from '../assets/assets'

const BlogItem = ({ blog, isNew }) => {
  return (
    <article className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer group'>
      {/* Image Container */}
      <div className='h-64 overflow-hidden bg-gray-200 relative'>
        <img
          src={blog.image}
          alt={blog.title}
          className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
        />
        
        {/* New AI Badge */}
        
      </div>

      {/* Content */}
      <div className='p-6'>
        {/* Category Badge */}
        <span className='inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-3'>
          {blog.category}
        </span>

        {/* Title */}
        <h3 className='text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition'>
          {blog.title}
        </h3>

        {/* Description */}
        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
          {blog.subTitle || blog.description}
        </p>

        {/* Footer with Star and Read More */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img src={assets.star_icon} alt='Star' className='w-5 h-5' />
            <span className='text-sm text-gray-500'>5.0</span>
          </div>
          <a
            href={`/blog/${blog._id}`}
            className='text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 text-sm'
          >
            Read More
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

export default BlogItem
