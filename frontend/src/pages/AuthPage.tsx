import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const authUser =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password)
      navigate(authUser.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Unable to authenticate right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <p className="eyebrow">Online quiz system</p>
        <h1>Assess, analyze, and improve in one workspace.</h1>
        <p className="muted">
          Secure JWT authentication, clean analytics, timed quizzes, and separate admin and user
          journeys built for modern teams.
        </p>
      </div>

      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <div className="segment">
          <button
            type="button"
            className={mode === 'login' ? 'segment-button active' : 'segment-button'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'segment-button active' : 'segment-button'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'register' && (
          <label>
            Full name
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error && <div className="error-banner">{error}</div>}

        <button className="primary-button" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login securely' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
