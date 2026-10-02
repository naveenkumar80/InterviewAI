import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import LoadingState from '../../../components/LoadingState'
import { 
    User, 
    EnvelopeSimple, 
    LockKey, 
    Eye, 
    EyeSlash, 
    Check, 
    WarningCircle,
    ArrowRight
} from '@phosphor-icons/react'

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!username.trim() || !email.trim() || !password) {
            setError('Please fill in all fields to create your account.')
            return
        }

        if (password.length < 6) {
            setError('Password should be at least 6 characters long.')
            return
        }

        setIsSubmitting(true)
        try {
            await handleRegister({ username: username.trim(), email: email.trim(), password })
            navigate('/')
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please check your credentials.'
            setError(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return <LoadingState title="Creating account" subtitle="Setting up your workspace..." steps={[]} />
    }

    return (
        <main className="auth-page">
            <div className="auth-layout">
                {/* Left Brand Panel */}
                <div className="auth-brand-panel">
                    <div>
                        <div className="brand-mark">
                            <div className="brand-icon">IA</div>
                            <span className="brand-title">InterviewAI</span>
                        </div>

                        <div className="brand-hero">
                            <h2>Structured interview preparation</h2>
                            <p>Map out study plans, simulate technical questions, and practice behavioral responses for upcoming rounds.</p>
                        </div>

                        <ul className="features-list">
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>Direct alignment with target job descriptions</span>
                            </li>
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>Day-by-day practice checklists</span>
                            </li>
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>PDF resume export tailored to requirements</span>
                            </li>
                        </ul>
                    </div>

                    <div className="brand-footer">
                        <span>Personalized candidate workspace</span>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="auth-form-panel">
                    <div className="form-header">
                        <h1>Create account</h1>
                        <p>Sign up to generate personalized interview plans</p>
                    </div>

                    {error && (
                        <div className="form-error-alert" role="alert">
                            <WarningCircle size={16} weight="fill" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="input-field">
                            <label htmlFor="username">Full Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="Your name"
                                    required
                                    autoComplete="name"
                                />
                                <span className="input-icon">
                                    <User size={16} />
                                </span>
                            </div>
                        </div>

                        <div className="input-field">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                />
                                <span className="input-icon">
                                    <EnvelopeSimple size={16} />
                                </span>
                            </div>
                        </div>

                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="At least 6 characters"
                                    required
                                    autoComplete="new-password"
                                />
                                <span className="input-icon">
                                    <LockKey size={16} />
                                </span>
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="button primary-button submit-button"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="btn-spinner" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={14} weight="bold" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Already have an account?</span>
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register
