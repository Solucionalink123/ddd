import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './Login'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={loggedIn ? <Home /> : <Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App