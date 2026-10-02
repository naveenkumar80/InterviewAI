import React, { useState, useEffect } from 'react'
import './LoadingState.scss'

const DEFAULT_STEPS = [
    'Parsing job description requirements...',
    'Analyzing candidate profile & experience...',
    'Generating targeted technical challenge questions...',
    'Synthesizing behavioral scenarios & model answers...',
    'Formulating day-by-day preparation roadmap...'
]

const LoadingState = ({
    title = 'Generating interview plan',
    subtitle = 'Analyzing requirements and tailoring questions to your resume.',
    steps = DEFAULT_STEPS
}) => {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (!steps || steps.length === 0) return
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
        }, 2800)

        return () => clearInterval(interval)
    }, [steps])

    return (
        <div className="loading-state-container">
            <div className="loading-card">
                {/* Minimalist Top Progress Bar */}
                <div className="progress-track">
                    <div className="progress-bar-indeterminate" />
                </div>

                <div className="loading-body">
                    <h2 className="loading-title">{title}</h2>
                    <p className="loading-subtitle">{subtitle}</p>

                    {steps && steps.length > 0 && (
                        <div className="steps-container">
                            <span className="current-step-label">
                                <span className="step-indicator" />
                                {steps[currentStep]}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LoadingState
