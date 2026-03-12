import { useState } from 'react'

import AdminDashboard from '../components/AdminDashboard'
import AuthorDashboard from '../components/AuthorDashboard'
import Login from '../components/Login'
import Navbar from '../components/Navbar'
import Register from '../components/Register'
import { useAuthStore } from '../store/userAuth'
import UserDashboard from '../components/UserDashboard'

function Home() {
  const [activeView, setActiveView] = useState('home')
  const currentUser = useAuthStore((state) => state.currentUser)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const handleLoginSuccess = (user) => {
    const dashboardByRole = {
      USER: 'user-dashboard',
      AUTHOR: 'author-dashboard',
      ADMIN: 'admin-dashboard',
    }

    setActiveView(dashboardByRole[user.role] ?? 'home')
  }

  const handleLogout = async () => {
    await logout()
    setActiveView('home')
  }

  const renderSelectedView = () => {
    switch (activeView) {
      case 'register':
        return <Register onSwitchToLogin={() => setActiveView('login')} />
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />
      case 'user-dashboard':
        return <UserDashboard />
      case 'author-dashboard':
        return <AuthorDashboard />
      case 'admin-dashboard':
        return <AdminDashboard />
    
      default:
        return (
          <section className="welcome-card">
            <h2 className="text-4xl font-semibold text-slate-800">
              Welcome to Blog Platform
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Use the navbar to open the Register, Login !
            </p>
          </section>
        )
    }
  }

  return (
    <div className="page-shell">
      <div className="layout-shell">
        {/* Keep navigation state here until React Router is introduced later. */}
        <Navbar
          activeView={activeView}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={setActiveView}
        />

        <main className="content-stage">{renderSelectedView()}</main>
      </div>
    </div>
  )
}

export default Home
