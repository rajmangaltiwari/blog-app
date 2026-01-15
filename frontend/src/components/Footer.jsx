const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300 py-6'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center text-sm'>
          <h2 className='text-lg font-bold text-white mb-3 md:mb-0'>📝 My Blog</h2>
          <div className='flex gap-6'>
            <a href='#' className='hover:text-white transition'>Privacy</a>
            <a href='#' className='hover:text-white transition'>Contact</a>
            <a href='#' className='hover:text-white transition'>Terms</a>
          </div>
        </div>
        <div className='text-center text-xs text-gray-400 mt-4'>
          &copy; 2025 My Blog. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
