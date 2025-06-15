import React, { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      setLoggedIn(true)
    }
  }

  return (
    <div className="container">
      {!loggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div>
          <h2>Bem-vindo ao Deezer Clone!</h2>
          {/* Aqui vamos renderizar o carrossel e integração com a API futuramente */}
        </div>
      )}
    </div>
  )
}

export default App