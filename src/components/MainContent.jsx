
import React from 'react'
import MusicCarousel from './MusicCarousel'
import ArtistCarousel from './ArtistCarousel'
import './MainContent.css'

const MainContent = () => {
  return (
    <div className="main-content">
      <header className="main-header">
        <div className="header-nav">
          <button className="nav-btn">❮</button>
          <button className="nav-btn">❯</button>
        </div>
        <div className="header-actions">
          <button className="premium-btn" onClick={() => alert('Redirecionando para página Premium...')}>Premium</button>
          <button className="support-btn" onClick={() => alert('Central de Ajuda: Entre em contato conosco!')}>Suporte</button>
          <button className="download-btn">Baixar</button>
          <button className="profile-btn">👤</button>
          <button className="install-btn">📱 Instalar aplicativo</button>
          <button className="signup-btn">Inscrever-se</button>
          <button className="login-btn">Entrar</button>
        </div>
      </header>

      <div className="content-sections">
        <section className="music-section">
          <div className="section-header">
            <h2>Músicas em alta</h2>
            <button className="show-all">Mostrar tudo</button>
          </div>
          <MusicCarousel />
        </section>

        <section className="artists-section">
          <div className="section-header">
            <h2>Artistas populares</h2>
            <button className="show-all">Mostrar tudo</button>
          </div>
          <ArtistCarousel />
        </section>

        <section className="singles-section">
          <div className="section-header">
            <h2>Singles e álbuns que todo mundo gosta</h2>
            <button className="show-all">Mostrar tudo</button>
          </div>
          <MusicCarousel />
        </section>
      </div>

      <div className="premium-banner">
        <div className="banner-content">
          <h3>Testar o Premium de graça</h3>
          <p>Inscreva-se para curtir música ilimitada e podcasts só com alguns anúncios. Não precisa de cartão de crédito.</p>
        </div>
        <button className="free-signup-btn">Inscreva-se grátis</button>
      </div>
    </div>
  )
}

export default MainContent
