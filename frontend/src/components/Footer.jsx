import { assets } from '../assets/assets'

const Footer = () => {
  const footer_data = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
    },
    {
      title: "Need Help?",
      links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"]
    }
  ]

  return (
    <footer className='bg-gray-900 text-gray-300'>
      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* Brand Section */}
          <div className='mb-8 md:mb-0'>
            <h2 className='text-2xl font-bold text-white mb-4'>📝 My Blog</h2>
            <p className='text-gray-400 mb-6'>
              Your space to think out loud, to share what matters, and to write without filters.
            </p>
            {/* Social Icons */}
            <div className='flex gap-4'>
              <a href='#' className='text-gray-400 hover:text-white transition'>
                <img src={assets.facebook_icon} alt='Facebook' className='w-6 h-6' />
              </a>
              <a href='#' className='text-gray-400 hover:text-white transition'>
                <img src={assets.twitter_icon} alt='Twitter' className='w-6 h-6' />
              </a>
              <a href='#' className='text-gray-400 hover:text-white transition'>
                <img src={assets.googleplus_icon} alt='Google+' className='w-6 h-6' />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className='text-white font-semibold mb-4'>{section.title}</h3>
              <ul className='space-y-3'>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href='#' 
                      className='text-gray-400 hover:text-white transition text-sm'
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className='border-t border-gray-700 my-8'></div>

        {/* Bottom Footer */}
        <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
          <p>&copy; 2025 My Blog. All rights reserved.</p>
          <div className='flex gap-6 mt-4 md:mt-0'>
            <a href='#' className='hover:text-white transition'>Privacy Policy</a>
            <a href='#' className='hover:text-white transition'>Terms of Service</a>
            <a href='#' className='hover:text-white transition'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
