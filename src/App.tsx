import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import DashboardPage from './components/pages/DashboardPage'

// Ponlo en true para volver a exigir login
const LOGIN_ENABLED = false

function App() {
  const { session, loading } = useAuth()

  if (!LOGIN_ENABLED) {
    return <DashboardPage />
  }

  if (loading) {
    return <div className="auth-loading" role="status">Preparando el viaje…</div>
  }

  return session ? <DashboardPage /> : <Login />
}

export default App
