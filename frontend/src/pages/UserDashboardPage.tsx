import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { AppShell } from '../layouts/AppShell'
import type { LeaderboardEntry, QuizSummary, ResultItem } from '../types'

export function UserDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [results, setResults] = useState<ResultItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      return
    }

    Promise.all([
      api.get<QuizSummary[]>('/quiz/list'),
      api.get<ResultItem[]>(`/user/results/${user.userId}`),
      api.get<LeaderboardEntry[]>('/leaderboard'),
    ])
      .then(([quizResponse, resultResponse, leaderboardResponse]) => {
        setQuizzes(quizResponse.data)
        setResults(resultResponse.data)
        setLeaderboard(leaderboardResponse.data)
      })
      .finally(() => setLoading(false))
  }, [user])

  const averageScore =
    results.length === 0
      ? '0%'
      : `${(results.reduce((sum, item) => sum + item.percentage, 0) / results.length).toFixed(1)}%`

  return (
    <AppShell
      title="Available quizzes"
      subtitle="Pick a quiz, start the timer, and review your progress over time."
    >
      {loading ? (
        <div className="panel">Loading your workspace...</div>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard label="Available quizzes" value={quizzes.length} />
            <StatCard label="Completed attempts" value={results.length} />
            <StatCard label="Average score" value={averageScore} />
          </section>

          <section className="dashboard-grid">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Quiz catalog</h2>
                  <p className="muted">Each quiz is timed and scored instantly on submission.</p>
                </div>
              </div>
              <div className="quiz-grid">
                {quizzes.map((quiz) => (
                  <article key={quiz.id} className="quiz-card">
                    <span className="pill">{quiz.category || 'General'}</span>
                    <h3>{quiz.title}</h3>
                    <p className="muted">{quiz.description}</p>
                    <div className="quiz-meta">
                      <span>{quiz.questionCount} questions</span>
                      <span>{quiz.timeLimit} min</span>
                    </div>
                    <button className="primary-button" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                      Start quiz
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <div className="stack">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>History</h2>
                    <p className="muted">Track your latest outcomes and improvement curve.</p>
                  </div>
                </div>
                <div className="table-list">
                  {results.map((result) => (
                    <div key={result.id} className="table-row table-row-wrap">
                      <span>{result.quizTitle}</span>
                      <span>
                        {result.score}/{result.totalQuestions} ({result.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Leaderboard preview</h2>
                    <p className="muted">See how your top attempt compares with others.</p>
                  </div>
                </div>
                <div className="table-list">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={`${entry.userId}-${entry.attemptedAt}`} className="table-row">
                      <span>
                        #{index + 1} {entry.userName}
                      </span>
                      <span>{entry.percentage.toFixed(1)}%</span>
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
