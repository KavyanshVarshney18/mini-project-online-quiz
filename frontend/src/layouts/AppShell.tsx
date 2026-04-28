import { BarChart3, ClipboardList, LogOut, Trophy } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

const navConfig: Record<Role, Array<{ to: string; label: string; icon: typeof BarChart3 }>> = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: BarChart3 },
  ],
  USER: [
    { to: '/dashboard', label: 'Quizzes', icon: ClipboardList },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ],
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">QuizSphere</div>
          <p className="brand-copy">Modern assessment workspace for admins and learners.</p>
          <nav className="nav">
            {navConfig[user.role].map((item) => {
              const Icon = item.icon
              return (
                <NavLink key={item.to} to={item.to} className="nav-link">
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
        <button className="ghost-button logout-button" onClick={logout}>
          <LogOut size={16} />
          Sign out
        </button>
      </aside>
      <main className="content">
        <header className="page-header">
          <div>
            <p className="eyebrow">{user.role === 'ADMIN' ? 'Admin workspace' : 'Learner workspace'}</p>
            <h1>{title}</h1>
            <p className="muted">{subtitle}</p>
          </div>
          <div className="profile-card">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
