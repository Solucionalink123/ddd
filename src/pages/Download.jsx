
import React, { useState } from 'react'
import './Download.css'

const Download = ({ onDownload }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('')

  const handleDownload = (platform) => {
    setSelectedPlatform(platform)
    
    const downloadLinks = {
      windows: 'https://download.music-app.com/windows',
      mac: 'https://download.music-app.com/mac',
      android: 'https://play.google.com/store/apps/music-app',
      ios: 'https://apps.apple.com/app/music-app'
    }

    // Simular download
    alert(`Iniciando download para ${platform.toUpperCase()}...`)
    
    if (onDownload) {
      onDownload()
    }
    
    // Em um app real, você redirecionaria para o link de download
    // window.open(downloadLinks[platform], '_blank')
  }

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      icon: '🖥️',
      description: 'Windows 10 ou superior',
      size: '120 MB'
    },
    {
      id: 'mac',
      name: 'macOS',
      icon: '🍎',
      description: 'macOS 10.14 ou superior',
      size: '115 MB'
    },
    {
      id: 'android',
      name: 'Android',
      icon: '🤖',
      description: 'Android 6.0 ou superior',
      size: '85 MB'
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: '📱',
      description: 'iOS 12.0 ou superior',
      size: '90 MB'
    }
  ]

  return (
    <div className="download-page modal-page">
      <div className="download-header">
        <h1>📥 Baixar App</h1>
        <p>Baixe nosso app e leve sua música para qualquer lugar</p>
      </div>

      <div className="download-content">
        <div className="platforms-grid">
          {platforms.map(platform => (
            <div key={platform.id} className="platform-card">
              <div className="platform-icon">{platform.icon}</div>
              <h3>{platform.name}</h3>
              <p className="platform-description">{platform.description}</p>
              <p className="platform-size">Tamanho: {platform.size}</p>
              <button
                className="download-btn"
                onClick={() => handleDownload(platform.id)}
              >
                Baixar para {platform.name}
              </button>
            </div>
          ))}
        </div>

        <div className="download-features">
          <h2>Recursos do App</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🎵</span>
              <div>
                <h4>Milhões de músicas</h4>
                <p>Acesse nossa biblioteca completa</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h4>Offline</h4>
                <p>Baixe e ouça sem internet</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <h4>Recomendações</h4>
                <p>Descubra novas músicas</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔊</span>
              <div>
                <h4>Alta qualidade</h4>
                <p>Som cristalino em todos os dispositivos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="qr-section">
          <h3>Escaneie para baixar no celular</h3>
          <div className="qr-code">
            <div className="qr-placeholder">
              📱<br/>
              QR Code<br/>
              (Simulado)
            </div>
          </div>
          <p>Aponte a câmera do seu celular para o QR code</p>
        </div>
      </div>
    </div>
  )
}

export default Download
