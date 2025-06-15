
import React, { useState, useEffect } from 'react'
import './LyricsModal.css'

const LyricsModal = ({ isOpen, onClose, track }) => {
  const [lyrics, setLyrics] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && track) {
      fetchLyrics()
    }
  }, [isOpen, track])

  const fetchLyrics = async () => {
    setIsLoading(true)
    setError('')
    setLyrics('')

    try {
      // Tentativa com múltiplas APIs
      const apis = [
        `https://api.lyrics.ovh/v1/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.title)}`,
        `https://some-random-api.ml/lyrics?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist.name)}`
      ]

      let lyricsFound = false

      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl)
          const data = await response.json()
          
          if (data.lyrics) {
            setLyrics(data.lyrics)
            lyricsFound = true
            break
          }
        } catch (apiErr) {
          console.log('API falhou:', apiErr)
          continue
        }
      }

      if (!lyricsFound) {
        // Letra simulada se nenhuma API funcionar
        setLyrics(`🎵 Letra para "${track.title}" por ${track.artist.name} 🎵

Infelizmente, não conseguimos carregar a letra original desta música no momento.

Isto pode acontecer devido a:
• Limitações da API de letras
• Música muito nova ou rara
• Problemas de conectividade

Mas você pode continuar aproveitando a música! 
Use os controles do player para pausar, pular ou repetir.

🎶 Continue curtindo sua música! 🎶`)
      }
    } catch (err) {
      console.error('Erro ao buscar letra:', err)
      setLyrics(`🎵 "${track.title}" - ${track.artist.name} 🎵

Oops! Não conseguimos carregar a letra desta música.

Mas isso não vai parar a música! 
Continue usando os controles do player para:
• ⏸️ Pausar/Play
• ⏮️ Música anterior  
• ⏭️ Próxima música
• 🔄 Repetir

🎶 A música continua... 🎶`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="lyrics-modal-overlay" onClick={onClose}>
      <div className="lyrics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lyrics-header">
          <div className="track-info">
            <img src={track?.album?.cover_medium} alt={track?.title} />
            <div>
              <h3>{track?.title}</h3>
              <p>{track?.artist?.name}</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="lyrics-content">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Carregando letra...</p>
            </div>
          )}
          
          {lyrics && (
            <div className="lyrics-text">
              {lyrics.split('\n').map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LyricsModal
