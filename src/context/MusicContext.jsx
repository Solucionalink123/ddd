
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
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      playNext()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  const playTrack = async (track, playlist = []) => {
    try {
      if (!track || !track.preview) {
        console.error('Track or preview URL is missing')
        return
      }

      if (currentTrack?.id === track.id && isPlaying) {
        pauseTrack()
        return
      }

      setCurrentTrack(track)
      setCurrentPlaylist(playlist)
      
      const trackIndex = playlist.findIndex(t => t.id === track.id)
      setCurrentIndex(trackIndex >= 0 ? trackIndex : 0)

      if (audioRef.current) {
        audioRef.current.src = track.preview
        audioRef.current.load()
        
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Error playing track:', error)
          setIsPlaying(false)
        }
      }
    } catch (error) {
      console.error('Error in playTrack:', error)
    }
  }

  const pauseTrack = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resumeTrack = async () => {
    if (audioRef.current && audioRef.current.paused) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Error resuming track:', error)
      }
    }
  }

  const playNext = () => {
    if (currentPlaylist.length > 0 && currentIndex < currentPlaylist.length - 1) {
      const nextTrack = currentPlaylist[currentIndex + 1]
      playTrack(nextTrack, currentPlaylist)
    }
  }

  const playPrevious = () => {
    if (currentPlaylist.length > 0 && currentIndex > 0) {
      const prevTrack = currentPlaylist[currentIndex - 1]
      playTrack(prevTrack, currentPlaylist)
    }
  }

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const setAudioVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  const value = {
    currentTrack,
    isPlaying,
    currentPlaylist,
    currentIndex,
    currentTime,
    duration,
    volume,
    audioRef,
    playTrack,
    pauseTrack,
    resumeTrack,
    playNext,
    playPrevious,
    seekTo,
    setVolume: setAudioVolume
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  )
}

export default MusicContext
