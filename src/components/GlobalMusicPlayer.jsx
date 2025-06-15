
import React from 'react'
import { useMusicContext } from '../context/MusicContext'
import './GlobalMusicPlayer.css'

const GlobalMusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    skipTrack,
    previousTrack,
    handleProgressClick,
    formatTime
  } = useMusicContext()

  if (!currentTrack) return null

  const handleSkipNext = () => {
    console.log('Skip next clicked')
    if (skipTrack && typeof skipTrack === 'function') {
      skipTrack()
    } else {
      console.log('Skip function not available')
    }
  }

  const handleSkipPrevious = () => {
    console.log('Skip previous clicked')
    if (previousTrack && typeof previousTrack === 'function') {
      previousTrack()
    } else {
      console.log('Previous function not available')
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      if (pauseTrack && typeof pauseTrack === 'function') {
        pauseTrack()
      }
    } else {
      if (resumeTrack && typeof resumeTrack === 'function') {
        resumeTrack()
      }
    }
  }

  return (
    <div className="global-music-player">
      <div className="player-track-info">
        <img 
          src={currentTrack.album?.cover_small || currentTrack.album?.cover} 
          alt={currentTrack.title}
        />
        <div className="track-details">
          <h4>{currentTrack.title}</h4>
          <p>{currentTrack.artist?.name}</p>
        </div>
      </div>

      <div className="player-controls">
        <button className="control-btn prev-btn" onClick={handleSkipPrevious}>
          <span>⏮️</span>
        </button>
        <button 
          className="control-btn play-pause-btn" 
          onClick={handlePlayPause}
        >
          <span>{isPlaying ? '⏸️' : '▶️'}</span>
        </button>
        <button className="control-btn next-btn" onClick={handleSkipNext}>
          <span>⏭️</span>
        </button>
      </div>

      <div className="player-progress">
        <span className="time">{formatTime ? formatTime(currentTime) : '0:00'}</span>
        <div className="progress-bar" onClick={handleProgressClick}>
          <div 
            className="progress-fill" 
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="time">{formatTime ? formatTime(duration) : '0:00'}</span>
      </div>
    </div>
  )
}

export default GlobalMusicPlayer
