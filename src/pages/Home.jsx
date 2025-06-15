import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import MusicCarousel from '../components/MusicCarousel'
import ArtistCarousel from '../components/ArtistCarousel'
import Premium from './Premium'
import Signup from './Signup'
import Login from './Login'
import Support from './Support'
import Download from './Download'
import './Home.css'

const Home = () => {
  const { user } = useContext(AuthContext)
  const [activeModal, setActiveModal] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const showModal = (modalType) => {
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handlePremiumClick = () => {
    if (user) {
      showModal('premium')
    } else {
      showModal('login')
    }
  }

  const handleSupportClick = () => {
    showModal('support')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleSearchClick = () => {
    navigate('/search')
  }

  return (
    <div className="home">
      {/* Main Header */}
      <header className="main-header">
        <div className="nav-controls">
          <button className="nav-btn">◀</button>
          <button className="nav-btn">▶</button>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-bar" onClick={handleSearchClick}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="O que você quer ouvir?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </form>
        </div>

        <div className="header-actions">
          {/* Desktop Actions */}
          <div className="desktop-actions">
            <button 
              className="premium-btn"
              onClick={handlePremiumClick}
            >
              Explorar Premium
            </button>
            <button 
              className="support-btn"
              onClick={handleSupportClick}
            >
              Suporte
            </button>
            <button 
              className="download-btn"
              onClick={() => showModal('download')}
            >
              Baixar aplicativo
            </button>

            {user ? (
              <div className="user-profile">
                <button className="profile-btn">👤</button>
                <span className="user-name">{user.name}</span>
              </div>
            ) : (
              <>
                <button 
                  className="login-btn"
                  onClick={() => showModal('login')}
                >
                  Entrar
                </button>
                <button 
                  className="signup-btn"
                  onClick={() => showModal('signup')}
                >
                  Inscrever-se
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="mobile-menu-container">
            <button 
              className="hamburger-btn"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>

            {isMobileMenuOpen && (
              <div className="mobile-menu">
                <button 
                  className="premium-btn"
                  onClick={handlePremiumClick}
                >
                  Explorar Premium
                </button>
                <button 
                  className="support-btn"
                  onClick={handleSupportClick}
                >
                  Suporte
                </button>
                <button 
                  className="download-btn"
                  onClick={() => showModal('download')}
                >
                  Baixar aplicativo
                </button>

                {user ? (
                  <div className="mobile-user-profile">
                    <button className="profile-btn">👤</button>
                    <span className="user-name">{user.name}</span>
                  </div>
                ) : (
                  <>
                    <button 
                      className="mobile-login"
                      onClick={() => showModal('login')}
                    >
                      Entrar
                    </button>
                    <button 
                      className="mobile-signup"
                      onClick={() => showModal('signup')}
                    >
                      Inscrever-se
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Filter Tabs */}
      <div className="mobile-filter-tabs">
        <button className="filter-tab active">Tudo</button>
        <button className="filter-tab">Músicas</button>
        <button className="filter-tab">Artistas</button>
        <button className="filter-tab">Álbuns</button>
        <button className="filter-tab">Playlists</button>
        <button className="filter-tab">Podcasts</button>
        <button className="filter-tab">Audiolivros</button>
        <button className="filter-tab">Rock</button>
        <button className="filter-tab">Pop</button>
        <button className="filter-tab">Sertanejo</button>
        <button className="filter-tab">Eletrônica</button>
        <button className="filter-tab">Hip Hop</button>
        <button className="filter-tab">MPB</button>
        <button className="filter-tab">Jazz</button>
        <button className="filter-tab">Clássica</button>
      </div>

      {/* Main Content */}
      <div className="home-content">
          <MusicCarousel title="🎸 Rock Classics" genre="rock" />
          <MusicCarousel title="🎤 Pop Hits" genre="pop" />
          <MusicCarousel title="🎵 Hip Hop" genre="hip_hop" />
          <ArtistCarousel title="Artistas Populares" />
          <MusicCarousel title="🎧 Eletrônica" genre="eletronica" />
          <MusicCarousel title="🤠 Sertanejo" genre="sertanejo" />
          <MusicCarousel title="🌴 Reggae" genre="reggae" />
          <MusicCarousel title="🎺 Jazz" genre="jazz" />
          <MusicCarousel title="🕺 Funk" genre="funk" />
        </div>

      {/* Modals */}
      {activeModal === 'premium' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Premium onClose={closeModal} />
          </div>
        </div>
      )}

      {activeModal === 'signup' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Signup onClose={closeModal} />
          </div>
        </div>
      )}

      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Login onClose={closeModal} />
          </div>
        </div>
      )}

      {activeModal === 'support' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Support onClose={closeModal} />
          </div>
        </div>
      )}

      {activeModal === 'download' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Download onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home