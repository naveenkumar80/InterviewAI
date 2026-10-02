import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Navbar from '../../../components/Navbar'
import LoadingState from '../../../components/LoadingState'
import {
    Briefcase,
    User,
    UploadSimple,
    FilePdf,
    Check,
    X,
    Trash,
    ArrowRight,
    WarningCircle,
    Info,
    CalendarBlank
} from '@phosphor-icons/react'

const ROLE_PRESETS = [
    {
        title: 'Senior Frontend',
        description: 'Senior Frontend Engineer (React/TypeScript) required to architect component libraries, optimize Core Web Vitals, implement state management, and lead frontend performance initiatives.'
    },
    {
        title: 'Full Stack Engineer',
        description: 'Full Stack Software Engineer responsible for building end-to-end features using Node.js, Express, MongoDB, and React. Experience with RESTful APIs, JWT authentication, containerization, and microservices.'
    },
    {
        title: 'Machine Learning / AI',
        description: 'AI/ML Engineer to develop LLM-powered applications using vector embeddings, RAG pipelines, OpenAI / Gemini APIs, and Python. Experience with prompt evaluation and distributed systems.'
    }
]

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [uploadStatus, setUploadStatus] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const resumeInputRef = useRef(null)

    const navigate = useNavigate()

    const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0
    const charCount = jobDescription.length

    const validateAndProcessFile = (file) => {
        if (!file) return

        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        const maxSize = 3 * 1024 * 1024 // 3MB

        if (!isPdf) {
            setResumeFile(null)
            setUploadStatus({
                success: false,
                message: 'Only PDF documents are supported.'
            })
            if (resumeInputRef.current) resumeInputRef.current.value = ''
            return
        }

        if (file.size > maxSize) {
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
            setResumeFile(null)
            setUploadStatus({
                success: false,
                message: `File size (${sizeMb}MB) exceeds the 3MB limit.`
            })
            if (resumeInputRef.current) resumeInputRef.current.value = ''
            return
        }

        setResumeFile(file)
        const formattedSize = file.size < 1024 * 1024
            ? `${Math.round(file.size / 1024)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

        setUploadStatus({
            success: true,
            message: 'Resume attached',
            fileName: file.name,
            fileSize: formattedSize
        })
        setErrorMessage('')
    }

    const handleGenerateReport = async () => {
        setErrorMessage('')

        if (!jobDescription.trim()) {
            setErrorMessage('Please provide the target job description.')
            return
        }

        if (!resumeFile) {
            setErrorMessage('Please upload your resume in PDF format to enable role matching.')
            return
        }

        try {
            const data = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile: resumeFile
            })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setErrorMessage('Unable to generate strategy. Please try again.')
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Error generating interview plan.'
            setErrorMessage(msg)
        }
    }

    const applyPreset = (preset) => {
        setJobDescription(preset.description)
        if (errorMessage) setErrorMessage('')
    }

    if (loading) {
        return (
            <div className="home-wrapper">
                <Navbar />
                <LoadingState
                    title="Analyzing requirements and resume"
                    subtitle="Matching candidate experience against job requirements and structuring prep modules."
                    steps={[
                        'Extracting core technical and soft-skill requirements...',
                        'Evaluating resume experience and calculating overlap...',
                        'Drafting role-specific technical and behavioral questions...',
                        'Structuring day-by-day roadmap and practice targets...'
                    ]}
                />
            </div>
        )
    }

    return (
        <div className="home-wrapper">
            <Navbar />

            <main className="home-page">
                {/* Hero Header - Clean & Confident */}
                <header className="page-hero">
                    <h1>Targeted Interview Preparation</h1>
                    <p className="hero-subtitle">
                        Compare any job specification with your resume to generate relevant technical challenges, behavioral questions, and a structured study plan.
                    </p>

                    {/* Presets */}
                    <div className="presets-container">
                        <span className="presets-label">Sample roles:</span>
                        <div className="presets-list">
                            {ROLE_PRESETS.map((p, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className="preset-pill"
                                >
                                    {p.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Form Studio Card */}
                <section className="interview-studio-card">
                    <div className="studio-card__body">
                        {/* Left Panel: Job Description */}
                        <div className="panel panel--left">
                            <div className="panel__header">
                                <div className="panel__title-group">
                                    <Briefcase size={18} className="panel__icon" />
                                    <h2>Job Description</h2>
                                </div>
                                <span className="badge badge--primary">Required</span>
                            </div>

                            <div className="textarea-container">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => {
                                        setJobDescription(e.target.value)
                                        if (errorMessage) setErrorMessage('')
                                    }}
                                    className="panel__textarea"
                                    placeholder={`Paste the job description or role requirements here...\n\nExample:\nSenior Frontend Engineer with strong proficiency in React, TypeScript, and modern system design...`}
                                    maxLength={5000}
                                    rows={10}
                                />
                                <div className="char-counter">
                                    <span className="counter-words">{wordCount} words</span>
                                    <span className="counter-divider">&bull;</span>
                                    <span className="counter-chars">{charCount} / 5000 chars</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="panel-divider" />

                        {/* Right Panel: Candidate Profile */}
                        <div className="panel panel--right">
                            <div className="panel__header">
                                <div className="panel__title-group">
                                    <User size={18} className="panel__icon" />
                                    <h2>Candidate Profile</h2>
                                </div>
                                <span className="badge badge--primary">PDF Required</span>
                            </div>

                            {/* Dropzone */}
                            <div className="upload-container">
                                <label
                                    className={`dropzone ${isDragging ? 'dropzone--dragging' : ''} ${
                                        uploadStatus?.success === true ? 'dropzone--success' : ''
                                    } ${uploadStatus?.success === false ? 'dropzone--error' : ''}`}
                                    htmlFor="resume"
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setIsDragging(true)
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault()
                                        setIsDragging(false)
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        setIsDragging(false)
                                        const file = e.dataTransfer.files?.[0]
                                        if (file) validateAndProcessFile(file)
                                    }}
                                >
                                    {uploadStatus?.success === true ? (
                                        <div className="dropzone-content-success">
                                            <div className="file-chip">
                                                <FilePdf size={18} weight="fill" />
                                                <span className="file-name">{uploadStatus.fileName}</span>
                                                <span className="file-size">{uploadStatus.fileSize}</span>
                                            </div>
                                            <div className="dropzone-actions">
                                                <span className="action-hint">Click or drop to replace</span>
                                                <button
                                                    type="button"
                                                    className="remove-file-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        setResumeFile(null)
                                                        setUploadStatus(null)
                                                        if (resumeInputRef.current) resumeInputRef.current.value = ''
                                                    }}
                                                >
                                                    <Trash size={13} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : uploadStatus?.success === false ? (
                                        <div className="dropzone-content-error">
                                            <p className="dropzone-error-title">Upload Failed</p>
                                            <p className="dropzone-error-msg">{uploadStatus.message}</p>
                                            <span className="action-hint">Select a valid PDF file (max 3MB)</span>
                                        </div>
                                    ) : (
                                        <div className="dropzone-content-idle">
                                            <UploadSimple size={24} className="dropzone-upload-icon" />
                                            <p className="dropzone-title">Upload Resume (PDF)</p>
                                            <p className="dropzone-subtitle">Drag and drop or click to browse &bull; Max 3MB</p>
                                        </div>
                                    )}

                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        accept=".pdf"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) validateAndProcessFile(file)
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Additional Context */}
                            <div className="self-desc-container">
                                <label htmlFor="selfDescription" className="sublabel">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    id="selfDescription"
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="panel__textarea panel__textarea--short"
                                    placeholder="Any specific focus areas or missing context from your resume..."
                                    rows={3}
                                />
                            </div>

                            <div className="helper-callout">
                                <Info size={16} className="callout-icon" />
                                <p>The system analyzes your background against the target position to calculate fit and flag knowledge gaps.</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="error-banner" role="alert">
                            <WarningCircle size={18} weight="fill" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Card Footer */}
                    <div className="studio-card__footer">
                        <span className="security-notice">Resume parsed in-memory &bull; Never distributed</span>

                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="button primary-button btn-lg generate-btn"
                        >
                            <span>{loading ? 'Processing...' : 'Generate Plan'}</span>
                            <ArrowRight size={14} weight="bold" />
                        </button>
                    </div>
                </section>

                {/* Recent Plans */}
                {reports && reports.length > 0 && (
                    <section className="recent-reports-section">
                        <div className="section-header">
                            <h2>Previous Plans</h2>
                            <span className="reports-count-pill">{reports.length} Saved</span>
                        </div>

                        <div className="reports-grid">
                            {reports.map((report) => {
                                const score = report.matchScore || 0
                                const scoreTone = score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low'
                                return (
                                    <div
                                        key={report._id}
                                        className="report-card"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                navigate(`/interview/${report._id}`)
                                            }
                                        }}
                                    >
                                        <div className="report-card-top">
                                            <span className="report-date">
                                                {new Date(report.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className={`report-score-chip ${scoreTone}`}>
                                                {score}% Match
                                            </span>
                                        </div>

                                        <h3 className="report-card-title">{report.title || 'Role Strategy'}</h3>

                                        <div className="report-card-footer">
                                            <span className="open-link">Open Plan</span>
                                            <ArrowRight size={14} weight="bold" className="arrow-icon" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Minimal Footer */}
                <footer className="page-footer">
                    <p className="footer-copy">&copy; {new Date().getFullYear()} InterviewAI</p>
                    <div className="footer-links">
                        <a href="#privacy">Privacy</a>
                        <span className="dot">&bull;</span>
                        <a href="#terms">Terms</a>
                    </div>
                </footer>
            </main>
        </div>
    )
}

export default Home