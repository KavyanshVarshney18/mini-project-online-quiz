export type Role = 'ADMIN' | 'USER'

export interface AuthResponse {
  token: string
  userId: string
  name: string
  email: string
  role: Role
}

export interface QuizSummary {
  id: string
  title: string
  description: string
  timeLimit: number
  category?: string | null
  questionCount: number
}

export interface QuestionPublic {
  id: string
  questionText: string
  options: string[]
}

export interface QuizDetail {
  id: string
  title: string
  description: string
  timeLimit: number
  category?: string | null
  questions: QuestionPublic[]
}

export interface QuestionAdmin {
  id?: string
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface QuizAdmin {
  id: string
  title: string
  description: string
  timeLimit: number
  category?: string | null
  questions: QuestionAdmin[]
}

export interface ResultItem {
  id: string
  userId: string
  userName: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  attemptedAt: string
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  score: number
  totalQuestions: number
  percentage: number
  attemptedAt: string
}

export interface DashboardStats {
  totalQuizzes: number
  totalUsers: number
  totalAttempts: number
}

export interface AdminResultsPayload {
  stats: DashboardStats
  results: ResultItem[]
  topScorers: LeaderboardEntry[]
}

export interface QuizSubmissionResponse {
  resultId: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  attemptedAt: string
}
