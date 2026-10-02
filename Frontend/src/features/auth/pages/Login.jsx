import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import LoadingState from '../../../components/LoadingState'
import { 
    EnvelopeSimple, 
    LockKey, 
    Eye, 
    EyeSlash, 
    Check, 
    WarningCircle,
    ArrowRight
} from '@phosphor-icons/react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Please enter both your email address and password.')
            return
        }

        setIsSubmitting(true)
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Invalid email or password. Please try again.'
            setError(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return <LoadingState title="Signing in" subtitle="Retrieving account details..." steps={[]} />
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
                            <h2>Targeted interview preparation</h2>
                            <p>Generate focused questions, analyze skill gaps, and structure your preparation schedule for any role.</p>
                        </div>

                        <ul className="features-list">
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>Question sets mapped to specific job requirements</span>
                            </li>
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>Model answers with evaluation criteria</span>
                            </li>
                            <li>
                                <Check size={16} weight="bold" className="check-badge" />
                                <span>Role compatibility and skill gap analysis</span>
                            </li>
                        </ul>
                    </div>

                    <div className="brand-footer">
                        <span>Personalized preparation workspace</span>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="auth-form-panel">
                    <div className="form-header">
                        <h1>Sign in</h1>
                        <p>Enter your account credentials to continue</p>
                    </div>

                    {error && (
                        <div className="form-error-alert" role="alert">
                            <WarningCircle size={16} weight="fill" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
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
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
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
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={14} weight="bold" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Don't have an account?</span>
                        <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login
