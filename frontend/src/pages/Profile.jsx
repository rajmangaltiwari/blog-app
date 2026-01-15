import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogAPI, userAPI } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import { FiEdit2, FiTrash2, FiEye, FiUpload } from 'react-icons/fi'
import { BiCategory, BiTime } from 'react-icons/bi'

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  const [userDetails, setUserDetails] = useState(null)
  const [userBlogs, setUserBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState(null)

  // Fetch user details and blogs
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use user from context instead of fetching again
        setUserDetails(user)
        setEditData({
          name: user.name,
          email: user.email,
          bio: user.bio || '',
          avatar: user.avatar,
        })
        setPreviewAvatar(user.avatar)

        // Fetch user blogs
        const blogsRes = await blogAPI.getUserBlogs()
        if (blogsRes.success) {
          setUserBlogs(blogsRes.blogs)
        }
      } catch (err) {
        console.error('Error fetching user blogs:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAvatar(reader.result)
        setEditData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setUpdating(true)
      const response = await userAPI.updateProfile(editData)
      if (response.success) {
        setUserDetails(response.user)
        setPreviewAvatar(response.user.avatar)
        setEditMode(false)
        alert('Profile updated successfully')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await blogAPI.deleteBlog(blogId)
      if (response.success) {
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId))
        setDeleteConfirm(null)
        alert('Blog deleted successfully')
      }
    } catch (err) {
      console.error('Error deleting blog:', err)
      alert('Failed to delete blog')
    }
  }

  const handleEditBlog = (blogId) => {
    navigate(`/edit/${blogId}`)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4'></div>
          <p className='text-white text-lg'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-400 mb-4 text-lg'>Unable to load profile</p>
          <button
            onClick={() => navigate('/')}
            className='px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition'
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white py-8'>
      <div className='max-w-5xl mx-auto px-4'>
        {editMode ? (
          // Edit Profile Modal
          <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50'>
            <div className='bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full my-8'>
              <h2 className='text-2xl font-bold text-white mb-4 text-center'>Edit Profile</h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveProfile()
                }}
                className='space-y-4'
              >
                {/* Avatar Upload */}
                <div className='text-center'>
                  <img
                    src={previewAvatar}
                    alt='Avatar'
                    className='w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-purple-600'
                  />
                  <label className='inline-block cursor-pointer'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleAvatarChange}
                      className='hidden'
                    />
                    <span className='px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2'>
                      <FiUpload /> Change
                    </span>
                  </label>
                </div>

                {/* Name */}
                <div>
                  <label className='block text-gray-300 font-medium mb-1 text-sm'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={editData.name}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm'
                    placeholder='Your name'
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-gray-300 font-medium mb-1 text-sm'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={editData.email}
                    disabled
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-400 rounded-lg opacity-50 cursor-not-allowed text-sm'
                  />
                  <p className='text-xs text-gray-500 mt-0.5'>Cannot be changed</p>
                </div>

                {/* Bio */}
                <div>
                  <label className='block text-gray-300 font-medium mb-1 text-sm'>Bio</label>
                  <textarea
                    name='bio'
                    value={editData.bio}
                    onChange={handleEditChange}
                    rows='3'
                    maxLength='500'
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none text-sm'
                    placeholder='Write a short bio'
                  />
                  <p className='text-xs text-gray-400 mt-0.5'>{editData.bio.length}/500</p>
                </div>

                <div className='flex gap-2 pt-2'>
                  <button
                    type='submit'
                    disabled={updating}
                    className='flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 font-medium text-sm'
                  >
                    {updating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setEditMode(false)}
                    className='flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition font-medium text-sm'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* User Details Section */}
        <div className='p-8 md:p-12 mb-5'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-25'>
            {/* Avatar */}
            <div className='relative group'>
              <img
                src={previewAvatar || userDetails.avatar}
                alt={userDetails.name}
                className='w-40 h-40 rounded-full object-cover  shadow-lg'
              />
              <label className='absolute bottom-0 right-0 cursor-pointer'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  className='hidden'
                />
                <div className='bg-indigo-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition'>
                  <FiUpload className='text-white text-xl' />
                </div>
              </label>
            </div>

            {/* User Info */}
            <div className='flex-1 text-center md:text-left'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>{userDetails.name}</h1>
              <p className='text-gray-600 text-lg mb-4'>@{userDetails.email.split('@')[0]}</p>
              <p className='text-gray-700 text-base leading-relaxed mb-6 max-w-xl'>
                {userDetails.bio || 'No bio added yet. Click edit to add one!'}
              </p>
              
              <div className='flex gap-4 justify-center md:justify-start flex-wrap'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-gray-900'>{userBlogs.length}</p>
                  <p className='text-gray-600 text-sm'>Posts</p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className='mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition font-medium'
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div>
          <h2 className='text-3xl font-bold text-gray-900 '>My Blogs</h2>
          
          {userBlogs.length === 0 ? (
            <div className='text-center py-16 '>
              <p className='text-gray-400 text-lg mb-4'>You haven't published any blogs yet</p>
              <button
                onClick={() => navigate('/create')}
                className='px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-medium'
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-400 transition group'
                >
                  {/* Image */}
                  <div className='relative overflow-hidden h-64 bg-gray-100'>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300'
                      }}
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4'>
                      <button
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className='p-3 bg-white text-gray-900 rounded-full cursor-pointer hover:bg-gray-100 transition hover:scale-110'
                        title='View'
                      >
                        <FiEye className='text-xl' />
                      </button>
                      <button
                        onClick={() => handleEditBlog(blog._id)}
                        className='p-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition hover:scale-110'
                        title='Edit'
                      >
                        <FiEdit2 className='text-xl' />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(blog._id)}
                        className='p-3 bg-red-600 text-white rounded-full cursor-pointer hover:bg-red-700 transition hover:scale-110'
                        title='Delete'
                      >
                        <FiTrash2 className='text-xl' />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    <h3 className='text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition'>
                      {blog.title}
                    </h3>
                    <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                      {blog.subTitle}
                    </p>

                    {/* Meta Info */}
                    <div className='flex flex-wrap gap-3 items-center'>
                      <span className='px-3 py-1 bg-indigo-100 border border-indigo-300 text-indigo-700 text-xs rounded-full font-medium flex items-center gap-1'>
                        <BiCategory className='text-sm' />
                        {blog.category}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                        blog.isPublished
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className='text-gray-600 text-xs mt-4 flex items-center gap-2'>
                      <BiTime className='text-sm' />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {deleteConfirm === blog._id && (
                    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50'>
                      <div className='bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm mx-auto'>
                        <h3 className='text-xl font-bold text-white mb-4'>Delete Blog?</h3>
                        <p className='text-gray-400 mb-6'>
                          Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                        </p>
                        <div className='flex gap-3'>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className='flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium'
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className='flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition font-medium'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
