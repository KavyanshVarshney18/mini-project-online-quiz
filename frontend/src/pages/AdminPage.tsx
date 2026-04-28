import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { StatCard } from '../components/StatCard'
import { AppShell } from '../layouts/AppShell'
import type { AdminResultsPayload, QuestionAdmin, QuizAdmin } from '../types'

const emptyQuestion = (): QuestionAdmin => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
})

const emptyQuiz = {
  id: '',
  title: '',
  description: '',
  timeLimit: 10,
  category: '',
  questions: [emptyQuestion()],
}

export function AdminPage() {
  const [payload, setPayload] = useState<AdminResultsPayload | null>(null)
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>([])
  const [form, setForm] = useState(emptyQuiz)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const isEditing = Boolean(form.id)

  const loadData = async () => {
    setLoading(true)
    const [resultsResponse, quizzesResponse] = await Promise.all([
      api.get<AdminResultsPayload>('/admin/results'),
      api.get<QuizAdmin[]>('/admin/quiz'),
    ])
    setPayload(resultsResponse.data)
    setQuizzes(quizzesResponse.data)
    setLoading(false)
  }

  useEffect(() => {
    loadData().catch(() => setLoading(false))
  }, [])

  const totalQuestions = useMemo(
    () => form.questions.reduce((total, question) => total + (question.questionText ? 1 : 0), 0),
    [form.questions],
  )

  const updateQuestion = (index: number, updater: (question: QuestionAdmin) => QuestionAdmin) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? updater(question) : question,
      ),
    }))
  }

  const resetForm = () => {
    setForm(emptyQuiz)
    setMessage('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const payload = {
        title: form.title,
        description: form.description,
        timeLimit: Number(form.timeLimit),
        category: form.category,
        questions: form.questions,
      }

      if (isEditing) {
        await api.put(`/admin/quiz/${form.id}`, payload)
      } else {
        await api.post('/admin/quiz', payload)
      }

      await loadData()
      resetForm()
      setMessage(isEditing ? 'Quiz updated successfully.' : 'Quiz created successfully.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (quizId: string) => {
    await api.delete(`/admin/quiz/${quizId}`)
    await loadData()
    if (form.id === quizId) {
      resetForm()
    }
  }

  return (
    <AppShell
      title="Admin dashboard"
      subtitle="Track platform health, manage quizzes, and review learner performance."
    >
      {loading ? (
        <div className="panel">Loading dashboard...</div>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard label="Total quizzes" value={payload?.stats.totalQuizzes ?? 0} />
            <StatCard label="Registered users" value={payload?.stats.totalUsers ?? 0} />
            <StatCard label="Quiz attempts" value={payload?.stats.totalAttempts ?? 0} />
            <StatCard label="Draft question count" value={totalQuestions} />
          </section>

          <section className="dashboard-grid">
            <form className="panel form-panel" onSubmit={handleSubmit}>
              <div className="panel-header">
                <div>
                  <h2>{isEditing ? 'Edit quiz' : 'Create quiz'}</h2>
                  <p className="muted">Author timed MCQ quizzes with embedded questions.</p>
                </div>
                {isEditing && (
                  <button type="button" className="ghost-button" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
              </div>

              <label>
                Title
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </label>

              <div className="grid-two">
                <label>
                  Time limit (minutes)
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={form.timeLimit}
                    onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })}
                    required
                  />
                </label>
                <label>
                  Category
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="General knowledge"
                  />
                </label>
              </div>

              <div className="question-stack">
                {form.questions.map((question, index) => (
                  <div key={index} className="question-editor">
                    <div className="panel-header">
                      <strong>Question {index + 1}</strong>
                      {form.questions.length > 1 && (
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              questions: current.questions.filter((_, currentIndex) => currentIndex !== index),
                            }))
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <label>
                      Question text
                      <input
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(index, (current) => ({
                            ...current,
                            questionText: e.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <div className="grid-two">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex}>
                          Option {optionIndex + 1}
                          <input
                            value={option}
                            onChange={(e) =>
                              updateQuestion(index, (current) => ({
                                ...current,
                                options: current.options.map((item, currentOptionIndex) =>
                                  currentOptionIndex === optionIndex ? e.target.value : item,
                                ),
                              }))
                            }
                            required
                          />
                        </label>
                      ))}
                    </div>
                    <label>
                      Correct option
                      <select
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(index, (current) => ({
                            ...current,
                            correctAnswer: Number(e.target.value),
                          }))
                        }
                      >
                        {[0, 1, 2, 3].map((optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>
                            Option {optionIndex + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      questions: [...current.questions, emptyQuestion()],
                    }))
                  }
                >
                  Add question
                </button>
                <button className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : isEditing ? 'Update quiz' : 'Create quiz'}
                </button>
              </div>
              {message && <div className="success-banner">{message}</div>}
            </form>

            <div className="stack">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Quiz library</h2>
                    <p className="muted">Manage every quiz from one place.</p>
                  </div>
                </div>
                <div className="stack">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="list-card">
                      <div>
                        <strong>{quiz.title}</strong>
                        <p className="muted">
                          {quiz.questions.length} questions • {quiz.timeLimit} minutes
                        </p>
                      </div>
                      <div className="button-row">
                        <button className="ghost-button" onClick={() => setForm({ ...quiz, category: quiz.category ?? '' })}>
                          Edit
                        </button>
                        <button className="danger-button" onClick={() => handleDelete(quiz.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Top scoring users</h2>
                    <p className="muted">Best recent performances across the platform.</p>
                  </div>
                </div>
                <div className="table-list">
                  {payload?.topScorers.map((entry) => (
                    <div key={`${entry.userId}-${entry.attemptedAt}`} className="table-row">
                      <span>{entry.userName}</span>
                      <span>
                        {entry.score}/{entry.totalQuestions} ({entry.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>User results</h2>
                    <p className="muted">Latest submissions across all quizzes.</p>
                  </div>
                </div>
                <div className="table-list">
                  {payload?.results.map((result) => (
                    <div key={result.id} className="table-row table-row-wrap">
                      <span>
                        <strong>{result.userName}</strong> on {result.quizTitle}
                      </span>
                      <span>
                        {result.score}/{result.totalQuestions}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </>
      )}
    </AppShell>
  )
}
