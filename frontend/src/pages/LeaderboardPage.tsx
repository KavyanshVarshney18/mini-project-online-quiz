import { useEffect, useState } from 'react'
import api from '../api/client'
import { AppShell } from '../layouts/AppShell'
import type { LeaderboardEntry } from '../types'

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    api.get<LeaderboardEntry[]>('/leaderboard').then((response) => setEntries(response.data))
  }, [])

  return (
    <AppShell
      title="Leaderboard"
      subtitle="High-performing attempts across the platform, ranked by score and percentage."
    >
      <section className="panel">
        <div className="table-list">
          {entries.map((entry, index) => (
            <div key={`${entry.userId}-${entry.attemptedAt}`} className="table-row">
              <span>
                #{index + 1} {entry.userName}
              </span>
              <span>
                {entry.score}/{entry.totalQuestions} ({entry.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
