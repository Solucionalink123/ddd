import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="sidebar">
      {/* Desktop Header */}
      <div className="sidebar-header desktop-only">
        <div className="elance-logo">
          <img 
            src="/elance-music-logo.png" 
            alt="Elance Music" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="logo-text">Elance Music</span>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sidebar-header mobile-only">
        <span className="logo-text">EM</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Início</span>
        </Link>
        <Link to="/search" className={`nav-item ${location.pathname === '/search' ? 'active' : ''}`}>
          <span className="nav-icon">🔍</span>
          <span className="nav-text">Buscar</span>
        </Link>
        <Link to="/library" className={`nav-item ${location.pathname === '/library' ? 'active' : ''}`}>
          <span className="nav-icon">📚</span>
          <span className="nav-text">Biblioteca</span>
        </Link>
      </nav>

      <div className="library-section">
        <div className="library-header">
          <h3>Sua Biblioteca</h3>
          <button className="add-btn">+</button>
        </div>

        <div className="library-content">
          <div className="create-playlist-section">
            <div className="create-playlist-info">
              <h4>Crie sua primeira playlist</h4>
              <p>É fácil, vamos te ajudar.</p>
            </div>
            <button className="create-playlist-btn">Criar playlist</button>
          </div>

          <div className="podcast-section">
            <div className="podcast-info">
              <h4>Que tal seguir um podcast novo?</h4>
              <p>Atualizaremos você sobre novos episódios.</p>
            </div>
            <button className="explore-podcasts-btn">Explorar podcasts</button>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="language-selector">
          <span>🌐 Português do Brasil</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar