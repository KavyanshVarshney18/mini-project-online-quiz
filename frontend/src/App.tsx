import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { AuthPage } from './pages/AuthPage'
import { AdminPage } from './pages/AdminPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { QuizAttemptPage } from './pages/QuizAttemptPage'
import { UserDashboardPage } from './pages/UserDashboardPage'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<ProtectedRoute role="USER" />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/quiz/:quizId" element={<QuizAttemptPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
