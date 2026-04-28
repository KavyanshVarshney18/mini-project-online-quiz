import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { AppShell } from '../layouts/AppShell'
import type { QuizDetail, QuizSubmissionResponse } from '../types'

export function QuizAttemptPage() {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [answers, setAnswers] = useState<Array<number | null>>([])
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null)

  useEffect(() => {
    if (!quizId) {
      return
    }
    api.get<QuizDetail>(`/quiz/${quizId}`).then((response) => {
      setQuiz(response.data)
      setAnswers(new Array(response.data.questions.length).fill(null))
      setSecondsLeft(response.data.timeLimit * 60)
    })
  }, [quizId])

  useEffect(() => {
    if (!quiz || result || secondsLeft <= 0) {
      return
    }
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [quiz, result, secondsLeft])

  useEffect(() => {
    if (quiz && secondsLeft === 0 && !result && !submitting) {
      void handleSubmit()
    }
  }, [secondsLeft, quiz, result, submitting])

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [secondsLeft])

  const handleSubmit = async () => {
    if (!quizId || !quiz) {
      return
    }
    setSubmitting(true)
    const normalizedAnswers = answers.map((answer) => (answer === null ? -1 : answer))
    const response = await api.post<QuizSubmissionResponse>(`/quiz/${quizId}/submit`, {
      answers: normalizedAnswers,
    })
    setResult(response.data)
    setSubmitting(false)
  }

  if (!quiz) {
    return (
      <AppShell title="Quiz loading" subtitle="Preparing your timed assessment.">
        <div className="panel">Loading quiz...</div>
      </AppShell>
    )
  }

  return (
    <AppShell title={quiz.title} subtitle={quiz.description}>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Timed attempt</h2>
            <p className="muted">The quiz auto-submits when the countdown ends.</p>
          </div>
          <div className="timer-chip">{formattedTime}</div>
        </div>

        {result ? (
          <div className="result-card">
            <h3>Submission complete</h3>
            <p className="muted">
              You scored {result.score} out of {result.totalQuestions} with a {result.percentage.toFixed(1)}%
              result.
            </p>
            <button className="primary-button" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </button>
          </div>
        ) : (
          <div className="question-stack">
            {quiz.questions.map((question, questionIndex) => (
              <div key={question.id} className="question-editor">
                <h3>
                  Question {questionIndex + 1}
                </h3>
                <p>{question.questionText}</p>
                <div className="option-stack">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      className={answers[questionIndex] === optionIndex ? 'option-button active' : 'option-button'}
                      onClick={() =>
                        setAnswers((current) =>
                          current.map((item, currentIndex) =>
                            currentIndex === questionIndex ? optionIndex : item,
                          ),
                        )
                      }
                    >
                      <span>{String.fromCharCode(65 + optionIndex)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button className="primary-button" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting...' : 'Submit quiz'}
              </button>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  )
}
