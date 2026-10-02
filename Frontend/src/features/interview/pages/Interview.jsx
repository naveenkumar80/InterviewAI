import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import Navbar from '../../../components/Navbar'
import LoadingState from '../../../components/LoadingState'
import {
    Code,
    ChatCenteredText,
    CalendarCheck,
    ArrowLeft,
    FilePdf,
    Copy,
    Check,
    CaretDown,
    CheckSquare,
    Square
} from '@phosphor-icons/react'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: <Code size={16} />,
        badgeKey: 'technicalQuestions'
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: <ChatCenteredText size={16} />,
        badgeKey: 'behavioralQuestions'
    },
    {
        id: 'roadmap',
        label: 'Preparation Roadmap',
        icon: <CalendarCheck size={16} />,
        badgeKey: 'preparationPlan'
    }
]

// ── Question Accordion Card ──────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(index === 0)
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        const textToCopy = `Question: ${item.question}\n\nInterviewer Intention: ${item.intention}\n\nModel Answer: ${item.answer}`
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div
                className="q-card__header"
                onClick={() => setOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setOpen((prev) => !prev)
                    }
                }}
            >
                <span className="q-card__number">{index + 1}.</span>
                <p className="q-card__question">{item.question}</p>

                <div className="q-card__actions">
                    <button
                        type="button"
                        className="copy-btn"
                        onClick={handleCopy}
                        title="Copy question and answer"
                        aria-label="Copy question"
                    >
                        {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                    </button>

                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <CaretDown size={16} />
                    </span>
                </div>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section intention-box">
                        <span className="section-label">Intention</span>
                        <p className="intention-text">{item.intention}</p>
                    </div>

                    <div className="q-card__section answer-box">
                        <span className="section-label">Model Answer</span>
                        <p className="answer-text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Interactive Roadmap Day Item ──────────────────────────────────────────────
const RoadMapDay = ({ day, dayIndex }) => {
    const [completedTasks, setCompletedTasks] = useState({})

    const toggleTask = (taskIndex) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [taskIndex]: !prev[taskIndex]
        }))
    }

    const totalTasks = day.tasks?.length || 0
    const completedCount = Object.values(completedTasks).filter(Boolean).length

    return (
        <div className="roadmap-day-card">
            <div className="roadmap-day__header">
                <div className="day-badge-wrap">
                    <span className="roadmap-day__badge">Day {day.day || dayIndex + 1}</span>
                    <span className="task-progress-chip">
                        {completedCount} of {totalTasks} completed
                    </span>
                </div>
                <h3 className="roadmap-day__focus">{day.focus}</h3>
            </div>

            <ul className="roadmap-day__tasks">
                {day.tasks.map((task, i) => {
                    const isDone = !!completedTasks[i]
                    return (
                        <li
                            key={i}
                            className={`task-item ${isDone ? 'task-item--done' : ''}`}
                            onClick={() => toggleTask(i)}
                            role="button"
                            tabIndex={0}
                        >
                            <span className="task-checkbox">
                                {isDone ? (
                                    <CheckSquare size={16} className="text-success" weight="fill" />
                                ) : (
                                    <Square size={16} />
                                )}
                            </span>
                            <span className="task-content">{task}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── Main Interview Component ──────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleDownloadPdf = async () => {
        if (!interviewId) return
        setIsDownloadingPdf(true)
        try {
            await getResumePdf(interviewId)
        } catch (err) {
            console.error('PDF error:', err)
        } finally {
            setIsDownloadingPdf(false)
        }
    }

    if (loading || !report) {
        return (
            <div className="interview-page-wrapper">
                <Navbar />
                <LoadingState
                    title="Loading plan"
                    subtitle="Retrieving tailored questions and roadmap..."
                    steps={[]}
                />
            </div>
        )
    }

    const matchScore = report.matchScore || 0
    const scoreColorClass =
        matchScore >= 80 ? 'score--high' : matchScore >= 60 ? 'score--mid' : 'score--low'

    // Radial circumference (r=36, C ≈ 226.19)
    const radius = 36
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (matchScore / 100) * circumference

    return (
        <div className="interview-page-wrapper">
            <Navbar />

            <div className="interview-page">
                {/* ── Top Bar ── */}
                <header className="strategy-header">
                    <div className="header-left">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="back-btn"
                        >
                            <ArrowLeft size={14} weight="bold" />
                            <span>Plans</span>
                        </button>

                        <div className="header-title-block">
                            <h1>{report.title || 'Role Strategy'}</h1>
                            <div className="header-meta">
                                <span className={`status-pill ${scoreColorClass}`}>
                                    {matchScore}% Match
                                </span>
                                <span className="meta-separator">&bull;</span>
                                <span className="meta-date">
                                    Generated {new Date(report.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="header-right">
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            disabled={isDownloadingPdf}
                            className="button secondary-button btn-sm download-resume-btn"
                        >
                            <FilePdf size={16} />
                            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Resume (PDF)'}</span>
                        </button>
                    </div>
                </header>

                {/* ── Studio Layout ── */}
                <div className="interview-layout">
                    {/* ── Left Navigation ── */}
                    <nav className="interview-nav" aria-label="Sections">
                        <div className="nav-top">
                            <span className="interview-nav__label">Sections</span>
                            <div className="nav-list">
                                {NAV_ITEMS.map((item) => {
                                    const count = report[item.badgeKey]?.length || 0
                                    const isActive = activeNav === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            className={`interview-nav__item ${isActive ? 'interview-nav__item--active' : ''}`}
                                            onClick={() => setActiveNav(item.id)}
                                        >
                                            <span className="interview-nav__icon">{item.icon}</span>
                                            <span className="interview-nav__text">{item.label}</span>
                                            <span className="interview-nav__count">{count}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Resume PDF Action */}
                        <div className="nav-resume-card">
                            <h4>Tailored Resume</h4>
                            <p>Export an updated PDF resume targeted to this job description.</p>
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={isDownloadingPdf}
                                className="button secondary-button btn-sm resume-card-btn"
                            >
                                {isDownloadingPdf ? 'Generating...' : 'Export PDF'}
                            </button>
                        </div>
                    </nav>

                    <div className="interview-divider" />

                    {/* ── Center Content ── */}
                    <main className="interview-content">
                        {activeNav === 'technical' && (
                            <section className="strategy-section">
                                <div className="content-header">
                                    <div>
                                        <h2>Technical Questions</h2>
                                        <p className="content-subtitle">
                                            Questions addressing core competencies and architecture required for this position.
                                        </p>
                                    </div>
                                    <span className="content-header__count">
                                        {report.technicalQuestions?.length || 0} Questions
                                    </span>
                                </div>

                                <div className="q-list">
                                    {report.technicalQuestions?.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section className="strategy-section">
                                <div className="content-header">
                                    <div>
                                        <h2>Behavioral Questions</h2>
                                        <p className="content-subtitle">
                                            Questions addressing teamwork, prioritization, and communication.
                                        </p>
                                    </div>
                                    <span className="content-header__count">
                                        {report.behavioralQuestions?.length || 0} Questions
                                    </span>
                                </div>

                                <div className="q-list">
                                    {report.behavioralQuestions?.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section className="strategy-section">
                                <div className="content-header">
                                    <div>
                                        <h2>Preparation Roadmap</h2>
                                        <p className="content-subtitle">
                                            Day-by-day checklist targeting identified skill gaps and core requirements.
                                        </p>
                                    </div>
                                    <span className="content-header__count">
                                        {report.preparationPlan?.length || 0} Days
                                    </span>
                                </div>

                                <div className="roadmap-list">
                                    {report.preparationPlan?.map((day, idx) => (
                                        <RoadMapDay key={day.day || idx} day={day} dayIndex={idx} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <div className="interview-divider" />

                    {/* ── Right Sidebar ── */}
                    <aside className="interview-sidebar">
                        {/* Match Score */}
                        <div className="sidebar-widget match-gauge-widget">
                            <span className="widget-label">Role Match</span>

                            <div className="gauge-container">
                                <svg className="gauge-svg" width="96" height="96" viewBox="0 0 90 90">
                                    <circle
                                        className="gauge-track"
                                        cx="45"
                                        cy="45"
                                        r={radius}
                                        strokeWidth="6"
                                    />
                                    <circle
                                        className={`gauge-indicator ${scoreColorClass}`}
                                        cx="45"
                                        cy="45"
                                        r={radius}
                                        strokeWidth="6"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 45 45)"
                                    />
                                </svg>
                                <div className="gauge-value-block">
                                    <span className="gauge-num">{matchScore}</span>
                                    <span className="gauge-pct">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-divider" />

                        {/* Skill Gaps */}
                        <div className="sidebar-widget skill-gaps-widget">
                            <div className="widget-header-row">
                                <span className="widget-label">Skill Gaps</span>
                                <span className="gap-count">{report.skillGaps?.length || 0}</span>
                            </div>

                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                <div className="skill-tags-cloud">
                                    {report.skillGaps.map((gap, i) => {
                                        const sev = gap.severity?.toLowerCase() || 'medium'
                                        return (
                                            <div key={i} className={`skill-gap-pill sev--${sev}`}>
                                                <span className="skill-name">{gap.skill}</span>
                                                <span className="sev-text">{sev}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="empty-gaps">
                                    <span>No critical gaps detected</span>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-divider" />

                        {/* Preparation Tip */}
                        <div className="sidebar-widget tip-widget">
                            <span className="widget-label">Method Tip</span>
                            <p className="tip-text">
                                Frame behavioral answers around Situation, Task, Action, and Result (STAR). Focus on quantifiable outcomes.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview