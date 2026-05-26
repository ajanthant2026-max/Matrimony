import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { MatchesProvider } from './context/MatchesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MatchesProvider>
        <App />
      </MatchesProvider>
    </AuthProvider>
  </StrictMode>,
)
