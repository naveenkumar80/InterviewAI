import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { SignOut, Plus, User } from '@phosphor-icons/react'
import './Navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const onLogout = async () => {
        try {
            await handleLogout()
            navigate('/login')
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                {/* Brand Logo - Minimalist & Confident */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-mark">
                        <span>IA</span>
                    </div>
                    <span className="brand-name">InterviewAI</span>
                </Link>

                {/* Right Side Navigation */}
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <nav className="navbar-nav">
                                <Link
                                    to="/"
                                    className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
                                >
                                    <Plus size={14} weight="bold" />
                                    <span>New Plan</span>
                                </Link>
                            </nav>

                            <div className="user-profile-menu">
                                <div className="user-pill" title={`Signed in as ${user.email || user.username}`}>
                                    <div className="user-avatar">
                                        {user.username ? user.username.charAt(0).toUpperCase() : <User size={13} />}
                                    </div>
                                    <span className="user-name">{user.username || 'Candidate'}</span>
                                </div>

                                <button
                                    onClick={onLogout}
                                    className="logout-btn"
                                    title="Sign out"
                                    aria-label="Sign out"
                                >
                                    <SignOut size={16} />
                                    <span className="logout-text">Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="button ghost-button btn-sm">
                                Sign In
                            </Link>
                            <Link to="/register" className="button primary-button btn-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
