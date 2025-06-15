
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { useDatabase } from '../hooks/useDatabase'
import './Login.css'

const Login = ({ onClose }) => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { loginUser } = useDatabase()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await loginUser(formData.email, formData.password)
      
      if (user) {
        login(user)
        console.log('Login realizado:', user)
        if (onClose) onClose()
        // navigate('/') // Remove navigation to stay on current page
      } else {
        setError('Email ou senha incorretos!')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page modal-page">
      <div className="login-container">
        <div className="login-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h1>🎵 Entrar</h1>
          <p>Bem-vindo de volta!</p>
        </div>

        <form className="login-form-new" onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              color: '#ff4444', 
              textAlign: 'center', 
              marginBottom: '1rem',
              padding: '0.5rem',
              background: 'rgba(255, 68, 68, 0.1)',
              borderRadius: '4px' 
            }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Sua senha"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="login-btn-new" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google">
              🔍 Continuar com Google
            </button>
            <button type="button" className="social-btn facebook">
              📘 Continuar com Facebook
            </button>
          </div>

          <p className="signup-link">
            Não tem uma conta? <a href="/signup">Inscreva-se</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
