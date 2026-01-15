import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import Profile from './pages/Profile'
import EditBlog from './pages/EditBlog'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CreateBlogBtn from './components/CreateBlogBtn'
import ProtectedRoute from './components/ProtectedRoute'

const AppContent = () => {
  const location = useLocation()
  
  // Hide navbar and footer on these routes
  const hideNavbarFooter = ['/login', '/signup', '/create', '/edit'].some(route => location.pathname.startsWith(route))

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar />}
      <div className='flex-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route 
            path='/create' 
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/edit/:id' 
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      {!hideNavbarFooter && <Footer />}
      <CreateBlogBtn />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App