import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const CreateBlogBtn = () => {
  try {
    const context = useContext(AuthContext)
    const user = context?.user

    // Only show button if user is logged in
    if (!user) {
      return null
    }

    return (
      <Link
        to="/create"
        className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-xl hover:scale-110 transition transform flex items-center justify-center text-white text-4xl z-40"
        title="Create a new blog post"
      >
        ✍️
      </Link>
    )
  } catch (error) {
    console.error('Error in CreateBlogBtn:', error)
    return null
  }
}

export default CreateBlogBtn
