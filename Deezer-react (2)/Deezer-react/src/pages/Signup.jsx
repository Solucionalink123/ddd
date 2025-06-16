
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { useDatabase } from '../hooks/useDatabase'
import './Signup.css'

const Signup = ({ onClose }) => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { registerUser } = useDatabase()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'free'
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres!')
      setLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        plan: formData.plan,
        avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=1db954&color=fff`
      }

      const user = await registerUser(userData)
      login(user)
      console.log('Cadastro realizado:', user)
      if (onClose) onClose()
      // navigate('/') // Remove navigation to stay on current page
    } catch (error) {
      console.error('Erro no cadastro:', error)
      if (error.message && error.message.includes('duplicate key')) {
        setError('Este email já está em uso!')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page modal-page">
      <div className="signup-container">
        <div className="signup-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h1>🎵 Cadastre-se</h1>
          <p>Crie sua conta e comece a ouvir!</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
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
            <label>Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <div className="plan-selection">
            <h3>Escolha seu plano</h3>
            <div className="plan-options">
              <label className="plan-option">
                <input
                  type="radio"
                  name="plan"
                  value="free"
                  checked={formData.plan === 'free'}
                  onChange={handleInputChange}
                />
                <div className="plan-card">
                  <h4>Gratuito</h4>
                  <p>Acesso básico com anúncios</p>
                </div>
              </label>

              <label className="plan-option">
                <input
                  type="radio"
                  name="plan"
                  value="premium"
                  checked={formData.plan === 'premium'}
                  onChange={handleInputChange}
                />
                <div className="plan-card">
                  <h4>Premium</h4>
                  <p>Sem anúncios, qualidade superior</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <p className="login-link">
            Já tem uma conta? <a href="/login">Faça login</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
