
import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext()

export const useMusicContext = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider')
  }
  return context
}

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration)
      })
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime)
      })
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const playTrack = (track, newPlaylist = null) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack()
    } else {
      setCurrentTrack(track)
      
      // Se uma nova playlist foi fornecida, atualiza a playlist
      if (newPlaylist && Array.isArray(newPlaylist)) {
        setPlaylist(newPlaylist)
        const trackIndex = newPlaylist.findIndex(t => t.id === track.id)
        setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0)
      }
      
      if (audioRef.current) {
        audioRef.current.src = track.preview
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error playing track:', error))
      }
    }
  }

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error resuming track:', error))
    }
  }

  const skipTrack = () => {
    console.log('Skip to next track')
    if (playlist.length > 0 && currentTrackIndex < playlist.length - 1) {
      const nextTrack = playlist[currentTrackIndex + 1]
      setCurrentTrackIndex(currentTrackIndex + 1)
      setCurrentTrack(nextTrack)
      
      if (audioRef.current) {
        audioRef.current.src = nextTrack.preview
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error playing next track:', error))
      }
      console.log('Skipped to next track:', nextTrack.title)
    } else {
      console.log('No next track available')
      // Se não há próxima música, para a atual
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const previousTrack = () => {
    console.log('Go to previous track')
    
    // Se a música tocou por mais de 3 segundos, volta ao início
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      console.log('Restarted current track')
    } else if (playlist.length > 0 && currentTrackIndex > 0) {
      // Vai para a música anterior
      const prevTrack = playlist[currentTrackIndex - 1]
      setCurrentTrackIndex(currentTrackIndex - 1)
      setCurrentTrack(prevTrack)
      
      if (audioRef.current) {
        audioRef.current.src = prevTrack.preview
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error playing previous track:', error))
      }
      console.log('Went to previous track:', prevTrack.title)
    } else {
      console.log('No previous track available')
    }
  }

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playlist,
    currentTrackIndex,
    playTrack,
    pauseTrack,
    resumeTrack,
    skipTrack,
    previousTrack,
    handleProgressClick,
    formatTime
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}
