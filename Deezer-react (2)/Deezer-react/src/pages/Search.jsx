import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../components/MusicCarousel.css'

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(location.search)
  const initialSearch = urlParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [searchResults, setSearchResults] = useState([])
  const [artistResults, setArtistResults] = useState([])
  const [activeTab, setActiveTab] = useState('musicas')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [likedTracks, setLikedTracks] = useState([])
  const [audioRef] = useState(React.createRef())

  React.useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime)
      const updateDuration = () => setDuration(audio.duration)

      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('loadedmetadata', updateDuration)

      return () => {
        audio.removeEventListener('timeupdate', updateTime)
        audio.removeEventListener('loadedmetadata', updateDuration)
      }
    }
  }, [currentPlaying])

  useEffect(() => {
    // Carregar músicas curtidas do localStorage
    const savedLikes = localStorage.getItem('likedTracks')
    if (savedLikes) {
      setLikedTracks(JSON.parse(savedLikes))
    }

    // Auto-buscar se houver termo na URL
    if (initialSearch) {
      handleAutoSearch(initialSearch)
    }
  }, [])

  const handleAutoSearch = async (term) => {
    if (!term.trim()) return

    setIsLoading(true)
    try {
      // Buscar músicas
      const tracksResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${term}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      })
      const tracksData = await tracksResponse.json()
      setSearchResults(tracksData.data || [])

      // Buscar artistas
      const artistsResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search/artist?q=${term}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      })
      const artistsData = await artistsResponse.json()
      setArtistResults(artistsData.data || [])
    } catch (err) {
      console.error('Erro na busca:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      // Buscar músicas
      const tracksResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchTerm}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      })
      const tracksData = await tracksResponse.json()
      setSearchResults(tracksData.data || [])

      // Buscar artistas
      const artistsResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search/artist?q=${searchTerm}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      })
      const artistsData = await artistsResponse.json()
      setArtistResults(artistsData.data || [])
    } catch (err) {
      console.error('Erro na busca:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const playTrack = (track, index) => {
    if (currentPlaying === track.id && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.preview
        audioRef.current.play()
        setCurrentPlaying(track.id)
        setCurrentTrackIndex(index)
        setIsPlaying(true)
      }
    }
  }

  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resumeTrack = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const skipTrack = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % searchResults.length
      const nextTrack = searchResults[nextIndex]
      playTrack(nextTrack, nextIndex)
    }
  }

  const previousTrack = () => {
    if (searchResults.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? searchResults.length - 1 : currentTrackIndex - 1
      const prevTrack = searchResults[prevIndex]
      playTrack(prevTrack, prevIndex)
    }
  }

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const progressBar = e.currentTarget
      const clickPosition = e.nativeEvent.offsetX
      const progressBarWidth = progressBar.offsetWidth
      const newTime = (clickPosition / progressBarWidth) * duration
      audioRef.current.currentTime = newTime
    }
  }

  const handleAudioEnd = () => {
    skipTrack()
  }

  const toggleLike = (track) => {
    const isLiked = likedTracks.some(liked => liked.id === track.id)
    let newLikedTracks

    if (isLiked) {
      newLikedTracks = likedTracks.filter(liked => liked.id !== track.id)
    } else {
      newLikedTracks = [...likedTracks, track]
    }

    setLikedTracks(newLikedTracks)
    localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks))

    const message = isLiked ? 'Removida das curtidas' : 'Adicionada às curtidas'
    showNotification(message, track.title)
  }

  const isTrackLiked = (trackId) => {
    return likedTracks.some(liked => liked.id === trackId)
  }

  const showNotification = (message, trackTitle) => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1db954;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `
    notification.innerHTML = `
      <div style="font-size: 14px;">${message}</div>
      <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">${trackTitle}</div>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const playRandomTrack = () => {
    if (searchResults.length > 0) {
      const randomIndex = Math.floor(Math.random() * searchResults.length)
      const randomTrack = searchResults[randomIndex]
      playTrack(randomTrack, randomIndex)
      showNotification('Reproduzindo aleatoriamente', randomTrack.title)
    }
  }

  const playArtistRadio = (artist) => {
    if (searchResults.length > 0) {
      const artistTracks = searchResults.filter(track => 
        track.artist.name.toLowerCase().includes(artist.name.toLowerCase())
      )
      if (artistTracks.length > 0) {
        const randomTrack = artistTracks[Math.floor(Math.random() * artistTracks.length)]
        const trackIndex = searchResults.findIndex(track => track.id === randomTrack.id)
        playTrack(randomTrack, trackIndex)
        showNotification(`Rádio ${artist.name}`, randomTrack.title)
      } else {
        showNotification('Nenhuma música encontrada', `para ${artist.name}`)
      }
    }
  }

  const showAllTracks = () => {
    setActiveTab('musicas')
    showNotification('Mostrando todas as músicas', '')
  }

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`)
  }

  const filteredTracks = searchResults.slice(0, 20)
  const filteredArtists = artistResults.slice(0, 8)

  const tabs = [
    { id: 'musicas', label: 'Músicas' },
    { id: 'albums', label: 'Álbuns' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'playlists-destaque', label: 'Playlists em destaque' },
    { id: 'playlists-comunidade', label: 'Playlists da comunidade' },
    { id: 'artistas', label: 'Artistas' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'episodios', label: 'Episódios' }
  ]

  const searchStyles = `
    .yt-search-container {
      background: #000;
      min-height: 100vh;
      color: white;
      padding: 24px 40px;
      padding-bottom: 140px;
    }

    .yt-search-header {
      max-width: 1200px;
      margin: 0 auto;
      margin-bottom: 32px;
    }

    .yt-search-input-container {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }

    .yt-search-input-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
    }

    .yt-search-input {
      width: 100%;
      padding: 14px 20px;
      padding-left: 50px;
      border-radius: 24px;
      border: 1px solid #333;
      background: #1a1a1a;
      color: white;
      font-size: 16px;
      outline: none;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .yt-search-input:focus {
      border-color: #fff;
      background: #2a2a2a;
    }

    .yt-search-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: #b3b3b3;
      font-size: 18px;
    }

    .yt-clear-button {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      font-size: 20px;
      padding: 5px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .yt-clear-button:hover {
      background: #333;
      color: white;
    }

    .yt-tabs-container {
      max-width: 1200px;
      margin: 0 auto;
      margin-bottom: 24px;
    }

    .yt-main-tabs {
      display: flex;
      gap: 40px;
      margin-bottom: 20px;
      border-bottom: 1px solid #333;
    }

    .yt-main-tab {
      background: none;
      border: none;
      color: #aaa;
      padding: 12px 0;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .yt-main-tab.active {
      color: white;
    }

    .yt-main-tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: white;
    }

    .yt-secondary-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 0;
    }

    .yt-secondary-tab {
      background: #2a2a2a;
      border: 1px solid #404040;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .yt-secondary-tab.active {
      background: white;
      color: black;
      border-color: white;
    }

    .yt-secondary-tab:hover:not(.active) {
      background: #404040;
      border-color: #555;
    }

    .yt-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .yt-main-result {
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .yt-main-result-image {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .yt-main-result-info {
      flex: 1;
    }

    .yt-main-result-name {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: white;
    }

    .yt-main-result-subtitle {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0 0 16px 0;
    }

    .yt-main-result-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .yt-action-button {
      padding: 12px 24px;
      border-radius: 20px;
      border: 1px solid #b3b3b3;
      background: transparent;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .yt-action-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }

    .yt-action-button.primary {
      background: white;
      color: black;
      border-color: white;
    }

    .yt-action-button.primary:hover {
      background: #e0e0e0;
    }

    .yt-section {
      margin-bottom: 32px;
    }

    .yt-section-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 20px 0;
      color: white;
    }

    .yt-track-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .yt-track-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .yt-track-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .yt-track-image {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .yt-track-info {
      flex: 1;
      min-width: 0;
    }

    .yt-track-title {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 4px 0;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .yt-track-subtitle {
      font-size: 14px;
      color: #aaa;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .yt-track-duration {
      font-size: 14px;
      color: #aaa;
      margin-left: 16px;
      flex-shrink: 0;
    }

    .yt-track-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .yt-track-item:hover .yt-track-actions {
      opacity: 1;
    }

    .yt-track-action {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .yt-track-action:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .yt-track-action.liked {
      background: #e53935;
    }

    .yt-show-all {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 16px 0;
      transition: color 0.3s;
    }

    .yt-show-all:hover {
      color: white;
    }

    .yt-empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #b3b3b3;
    }

    .yt-empty-state p {
      font-size: 16px;
      margin: 0;
      opacity: 0.8;
    }

    .yt-loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .yt-loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #333;
      border-top: 4px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Player de Música Estilizado */
    .yt-music-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
    }

    .yt-player-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(29, 185, 84, 0.1) 0%, transparent 70%);
      opacity: 0.5;
    }

    .yt-player-content {
      position: relative;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .yt-player-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .yt-player-image-container {
      position: relative;
      flex-shrink: 0;
    }

    .yt-player-image {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .yt-player-image-glow {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background: linear-gradient(45deg, #1db954, #1ed760, #1db954);
      border-radius: 12px;
      opacity: 0.3;
      filter: blur(8px);
      z-index: -1;
    }

    .yt-player-track-info {
      flex: 1;
      min-width: 0;
    }

    .yt-player-title {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .yt-player-artist {
      margin: 0;
      font-size: 14px;
      color: #b3b3b3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .yt-player-like {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .yt-player-like:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }

    .yt-player-like.liked {
      background: rgba(235, 57, 53, 0.8);
      border-color: #eb3935;
      animation: likeAnimation 0.3s ease;
    }

    .yt-player-controls-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .yt-player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .yt-player-control-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      width: 48px;
      height: 48px;
    }

    .yt-player-control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }

    .yt-player-play-pause {
      background: linear-gradient(135deg, #1db954, #1ed760) !important;
      border-color: #1db954 !important;
      width: 56px !important;
      height: 56px !important;
      font-size: 20px !important;
      box-shadow: 0 4px 16px rgba(29, 185, 84, 0.4);
    }

    .yt-player-play-pause:hover {
      background: linear-gradient(135deg, #1ed760, #21e065) !important;
      transform: scale(1.05) !important;
      box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
    }

    .yt-player-progress-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .yt-player-time {
      color: #b3b3b3;
      font-size: 12px;
      font-weight: 500;
      min-width: 40px;
      text-align: center;
    }

    .yt-player-progress-bar {
      flex: 1;
      height: 6px;
      position: relative;
      cursor: pointer;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .yt-player-progress-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .yt-player-progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background: linear-gradient(90deg, #1db954, #1ed760);
      border-radius: 3px;
      transition: width 0.1s ease;
      box-shadow: 0 0 8px rgba(29, 185, 84, 0.5);
    }

    .yt-player-progress-thumb {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      width: 14px;
      height: 14px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: all 0.2s ease;
    }

    .yt-player-progress-bar:hover .yt-player-progress-thumb {
      opacity: 1;
    }

    @keyframes likeAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .yt-search-container {
        padding: 16px 20px;
        padding-bottom: 160px;
      }

      .yt-main-tabs {
        display: none;
      }

      .yt-secondary-tabs {
        justify-content: flex-start;
      }

      .yt-main-result {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .yt-main-result-image {
        width: 100px;
        height: 100px;
      }

      .yt-main-result-name {
        font-size: 24px;
      }

      .yt-track-actions {
        opacity: 1;
      }

      .yt-player-content {
        padding: 12px 16px;
        gap: 12px;
      }

      .yt-player-info {
        gap: 12px;
      }

      .yt-player-image {
        width: 56px;
        height: 56px;
      }

      .yt-player-title {
        font-size: 16px;
      }

      .yt-player-artist {
        font-size: 13px;
      }

      .yt-player-like,
      .yt-player-control-btn {
        width: 44px;
        height: 44px;
        font-size: 16px;
      }

      .yt-player-play-pause {
        width: 52px !important;
        height: 52px !important;
        font-size: 18px !important;
      }

      .yt-player-controls {
        gap: 12px;
      }
    }
  `

  return (
    <div className="yt-search-container">
      <style>{searchStyles}</style>

      <div className="yt-search-header">
        <form onSubmit={handleSearch} className="yt-search-form">
          <div className="yt-search-input-container">
            <div className="yt-search-input-wrapper">
              <span className="yt-search-icon">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar músicas, artistas, álbuns..."
                className="yt-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="yt-clear-button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {(searchResults.length > 0 || artistResults.length > 0) && (
        <div className="yt-tabs-container">
          <div className="yt-main-tabs">
            <button 
              className="yt-main-tab active"
              onClick={() => showNotification('YT MUSIC ativo', 'Mostrando resultados da busca')}
            >
              YT MUSIC
            </button>
            <button 
              className="yt-main-tab"
              onClick={() => {
                navigate('/library')
                showNotification('Redirecionando', 'Indo para sua biblioteca')
              }}
            >
              BIBLIOTECA
            </button>
          </div>

          <div className="yt-secondary-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`yt-secondary-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="yt-content">
        {isLoading && (
          <div className="yt-loading-state">
            <div className="yt-loading-spinner"></div>
            <p>Buscando resultados...</p>
          </div>
        )}

        {!isLoading && (searchResults.length > 0 || artistResults.length > 0) && (
          <>
            {/* Resultado Principal */}
            {filteredArtists.length > 0 && (
              <div className="yt-main-result">
                <img 
                  src={filteredArtists[0].picture_medium || filteredArtists[0].picture} 
                  alt={filteredArtists[0].name}
                  className="yt-main-result-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120?text=Artist'
                  }}
                />
                <div className="yt-main-result-info">
                  <h1 className="yt-main-result-name">{filteredArtists[0].name}</h1>
                  <p className="yt-main-result-subtitle">
                    Artista • {filteredArtists[0].nb_fan ? `${Math.floor(filteredArtists[0].nb_fan / 1000000)}M` : '122M'} visitantes por mês
                  </p>
                  <div className="yt-main-result-actions">
                    <button 
                      className="yt-action-button primary"
                      onClick={() => playRandomTrack()}
                      title="Reproduzir músicas do artista aleatoriamente"
                    >
                      🎵 Aleatório
                    </button>
                    <button 
                      className="yt-action-button"
                      onClick={() => playArtistRadio(filteredArtists[0])}
                      title="Reproduzir rádio baseado no artista"
                    >
                      📻 Rádio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Seções baseadas na aba ativa */}
            {activeTab === 'musicas' && filteredTracks.length > 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Músicas</h2>
                <div className="yt-track-list">
                  {(filteredTracks.length > 6 && activeTab === 'musicas' ? filteredTracks : filteredTracks.slice(0, 6)).map((track, index) => (
                    <div className="yt-track-item" key={track.id}>
                      <img 
                        src={track.album.cover_medium} 
                        alt={track.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{track.title}</h3>
                        <p className="yt-track-subtitle">
                          🎵 Música • {track.artist.name} • {track.album.title} • {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')} • {Math.floor(Math.random() * 100)}M reproduções
                        </p>
                      </div>
                      <span className="yt-track-duration">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => playTrack(track, index)}
                          title={currentPlaying === track.id && isPlaying ? "Pausar" : "Reproduzir"}
                        >
                          {currentPlaying === track.id && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className={`yt-track-action ${isTrackLiked(track.id) ? 'liked' : ''}`}
                          onClick={() => toggleLike(track)}
                          title={isTrackLiked(track.id) ? "Remover das curtidas" : "Adicionar às curtidas"}
                        >
                          {isTrackLiked(track.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredTracks.length > 6 && (
                    <button 
                      className="yt-show-all"
                      onClick={showAllTracks}
                      title="Ver todas as músicas encontradas"
                    >
                      Mostrar tudo
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Álbuns */}
            {activeTab === 'albums' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Álbuns</h2>
                <div className="yt-track-list">
                  {[...new Map(filteredTracks.map(track => [track.album.id, track.album])).values()].slice(0, 8).map((album, index) => (
                    <div className="yt-track-item" key={album.id || index}>
                      <img 
                        src={album.cover_medium} 
                        alt={album.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{album.title}</h3>
                        <p className="yt-track-subtitle">
                          💿 Álbum • {filteredTracks.find(t => t.album.id === album.id)?.artist.name} • {new Date().getFullYear() - Math.floor(Math.random() * 10)} • {Math.floor(Math.random() * 15) + 8} faixas
                        </p>
                      </div>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => playRandomTrack()}
                          title="Reproduzir álbum"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Adicionar às curtidas"
                        >
                          🤍
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vídeos */}
            {activeTab === 'videos' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Vídeos</h2>
                <div className="yt-track-list">
                  {filteredTracks.slice(0, 6).map((track, index) => (
                    <div className="yt-track-item" key={`video-${track.id}`}>
                      <img 
                        src={track.album.cover_medium} 
                        alt={track.title}
                        className="yt-track-image"
                        style={{ position: 'relative' }}
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{track.title} (Vídeo Oficial)</h3>
                        <p className="yt-track-subtitle">
                          📹 Vídeo • {track.artist.name} • {Math.floor(Math.random() * 50) + 1}M visualizações • há {Math.floor(Math.random() * 3) + 1} anos
                        </p>
                      </div>
                      <span className="yt-track-duration">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => playTrack(track, index)}
                          title="Reproduzir vídeo"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Assistir mais tarde"
                        >
                          ⏰
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists em Destaque */}
            {activeTab === 'playlists-destaque' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Playlists em Destaque</h2>
                <div className="yt-track-list">
                  {[
                    { id: 1, title: `Best of ${searchTerm}`, subtitle: `As melhores de ${searchTerm}`, count: Math.floor(Math.random() * 50) + 20, creator: 'YT Music' },
                    { id: 2, title: `${searchTerm} Hits`, subtitle: `Os maiores sucessos de ${searchTerm}`, count: Math.floor(Math.random() * 40) + 15, creator: 'YT Music' },
                    { id: 3, title: `${searchTerm} Essentials`, subtitle: `O essencial de ${searchTerm}`, count: Math.floor(Math.random() * 60) + 25, creator: 'YT Music' },
                    { id: 4, title: `Deep ${searchTerm}`, subtitle: `Mergulhe fundo em ${searchTerm}`, count: Math.floor(Math.random() * 80) + 30, creator: 'YT Music' }
                  ].map((playlist, index) => (
                    <div className="yt-track-item" key={playlist.id}>
                      <img 
                        src={filteredTracks[index % filteredTracks.length]?.album.cover_medium || 'https://via.placeholder.com/48x48?text=Playlist'} 
                        alt={playlist.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{playlist.title}</h3>
                        <p className="yt-track-subtitle">
                          📋 Playlist • {playlist.creator} • {playlist.count} músicas
                        </p>
                      </div>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => playRandomTrack()}
                          title="Reproduzir playlist"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Adicionar à biblioteca"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists da Comunidade */}
            {activeTab === 'playlists-comunidade' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Playlists da Comunidade</h2>
                <div className="yt-track-list">
                  {[
                    { id: 5, title: `${searchTerm} Vibes`, creator: 'MusicLover2023', count: Math.floor(Math.random() * 30) + 10 },
                    { id: 6, title: `Ultimate ${searchTerm} Mix`, creator: 'PlaylistMaster', count: Math.floor(Math.random() * 25) + 12 },
                    { id: 7, title: `${searchTerm} for Study`, creator: 'StudyBeats', count: Math.floor(Math.random() * 40) + 20 },
                    { id: 8, title: `${searchTerm} Chill Mix`, creator: 'ChillVibes', count: Math.floor(Math.random() * 35) + 15 },
                    { id: 9, title: `${searchTerm} Workout`, creator: 'FitnessMusic', count: Math.floor(Math.random() * 45) + 18 }
                  ].map((playlist, index) => (
                    <div className="yt-track-item" key={playlist.id}>
                      <img 
                        src={filteredTracks[index % filteredTracks.length]?.album.cover_medium || 'https://via.placeholder.com/48x48?text=Playlist'} 
                        alt={playlist.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{playlist.title}</h3>
                        <p className="yt-track-subtitle">
                          👥 Playlist • {playlist.creator} • {playlist.count} músicas • {Math.floor(Math.random() * 1000) + 100} curtidas
                        </p>
                      </div>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => playRandomTrack()}
                          title="Reproduzir playlist"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Seguir playlist"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artistas */}
            {activeTab === 'artistas' && filteredArtists.length > 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Artistas</h2>
                <div className="yt-track-list">
                  {filteredArtists.map((artist, index) => (
                    <div className="yt-track-item" key={artist.id}>
                      <img 
                        src={artist.picture_medium || artist.picture} 
                        alt={artist.name}
                        className="yt-track-image"
                        style={{ borderRadius: '50%' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48?text=Artist'
                        }}
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{artist.name}</h3>
                        <p className="yt-track-subtitle">
                          👤 Artista • {artist.nb_fan ? `${Math.floor(artist.nb_fan / 1000000)}M` : 'N/A'} fãs
                        </p>
                      </div>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          onClick={() => handleArtistClick(artist)}
                          title="Ver artista"
                        >
                          👁️
                        </button>
                        <button 
                          className="yt-track-action"
                          onClick={() => playArtistRadio(artist)}
                          title="Reproduzir rádio do artista"
                        >
                          📻
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Podcasts */}
            {activeTab === 'podcasts' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Podcasts</h2>
                <div className="yt-track-list">
                  {[
                    { id: 101, title: `${searchTerm} Podcast`, host: 'Music Talk', episodes: Math.floor(Math.random() * 200) + 50 },
                    { id: 102, title: `The ${searchTerm} Show`, host: 'Entertainment Weekly', episodes: Math.floor(Math.random() * 150) + 30 },
                    { id: 103, title: `${searchTerm} Unplugged`, host: 'Acoustic Sessions', episodes: Math.floor(Math.random() * 100) + 25 },
                    { id: 104, title: `Deep Dive: ${searchTerm}`, host: 'Music Analysis', episodes: Math.floor(Math.random() * 80) + 20 }
                  ].map((podcast, index) => (
                    <div className="yt-track-item" key={podcast.id}>
                      <img 
                        src={`https://via.placeholder.com/48x48?text=🎙️`}
                        alt={podcast.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{podcast.title}</h3>
                        <p className="yt-track-subtitle">
                          🎙️ Podcast • {podcast.host} • {podcast.episodes} episódios
                        </p>
                      </div>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          title="Reproduzir último episódio"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Seguir podcast"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Episódios */}
            {activeTab === 'episodios' && (searchResults.length > 0) && (
              <div className="yt-section">
                <h2 className="yt-section-title">Episódios</h2>
                <div className="yt-track-list">
                  {[
                    { id: 201, title: `A História de ${searchTerm}`, podcast: 'Music Talk', duration: '45:32', date: '2 dias atrás' },
                    { id: 202, title: `${searchTerm}: Behind the Music`, podcast: 'Entertainment Weekly', duration: '38:15', date: '1 semana atrás' },
                    { id: 203, title: `Analisando ${searchTerm}`, podcast: 'Music Analysis', duration: '52:18', date: '2 semanas atrás' },
                    { id: 204, title: `${searchTerm} ao Vivo`, podcast: 'Live Sessions', duration: '41:27', date: '3 semanas atrás' },
                    { id: 205, title: `O Impacto de ${searchTerm}`, podcast: 'Cultural Impact', duration: '36:45', date: '1 mês atrás' }
                  ].map((episode, index) => (
                    <div className="yt-track-item" key={episode.id}>
                      <img 
                        src={`https://via.placeholder.com/48x48?text=🎧`}
                        alt={episode.title}
                        className="yt-track-image"
                      />
                      <div className="yt-track-info">
                        <h3 className="yt-track-title">{episode.title}</h3>
                        <p className="yt-track-subtitle">
                          🎧 Episódio • {episode.podcast} • {episode.date}
                        </p>
                      </div>
                      <span className="yt-track-duration">
                        {episode.duration}
                      </span>
                      <div className="yt-track-actions">
                        <button 
                          className="yt-track-action"
                          title="Reproduzir episódio"
                        >
                          ▶️
                        </button>
                        <button 
                          className="yt-track-action"
                          title="Adicionar à fila"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estados vazios para quando não há pesquisa */}
            {activeTab === 'albums' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Álbuns</h2>
                <div className="yt-empty-state">
                  <p>Faça uma pesquisa para descobrir álbuns incríveis</p>
                </div>
              </div>
            )}

            {activeTab === 'videos' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Vídeos</h2>
                <div className="yt-empty-state">
                  <p>Pesquise por artistas para encontrar seus vídeos musicais</p>
                </div>
              </div>
            )}

            {activeTab === 'playlists-destaque' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Playlists em Destaque</h2>
                <div className="yt-empty-state">
                  <p>Explore playlists curadas pelos nossos editores</p>
                </div>
              </div>
            )}

            {activeTab === 'playlists-comunidade' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Playlists da Comunidade</h2>
                <div className="yt-empty-state">
                  <p>Descubra playlists criadas pela comunidade</p>
                </div>
              </div>
            )}

            {activeTab === 'podcasts' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Podcasts</h2>
                <div className="yt-empty-state">
                  <p>Encontre podcasts sobre música e muito mais</p>
                </div>
              </div>
            )}

            {activeTab === 'episodios' && searchResults.length === 0 && (
              <div className="yt-section">
                <h2 className="yt-section-title">Episódios</h2>
                <div className="yt-empty-state">
                  <p>Ouça episódios de podcasts sobre seus artistas favoritos</p>
                </div>
              </div>
            )}

             {/* Player de Música */}
             {currentPlaying && (
              <div className="yt-music-player">
                <div className="yt-player-background"></div>
                
                <div className="yt-player-content">
                  <div className="yt-player-info">
                    <div className="yt-player-image-container">
                      <img 
                        src={searchResults.find(t => t.id === currentPlaying)?.album?.cover_medium || searchResults.find(t => t.id === currentPlaying)?.album?.cover_small} 
                        alt="Current track"
                        className="yt-player-image"
                      />
                      <div className="yt-player-image-glow"></div>
                    </div>
                    
                    <div className="yt-player-track-info">
                      <h4 className="yt-player-title">
                        {searchResults.find(t => t.id === currentPlaying)?.title}
                      </h4>
                      <p className="yt-player-artist">
                        {searchResults.find(t => t.id === currentPlaying)?.artist.name}
                      </p>
                    </div>

                    <button 
                      className={`yt-player-like ${isTrackLiked(currentPlaying) ? 'liked' : ''}`}
                      onClick={() => toggleLike(searchResults.find(t => t.id === currentPlaying))}
                      title={isTrackLiked(currentPlaying) ? "Remover das curtidas" : "Adicionar às curtidas"}
                    >
                      {isTrackLiked(currentPlaying) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="yt-player-controls-section">
                    <div className="yt-player-controls">
                      <button 
                        className="yt-player-control-btn yt-player-prev"
                        onClick={previousTrack}
                        title="Música anterior"
                      >
                        ⏮️
                      </button>
                      
                      <button 
                        className="yt-player-control-btn yt-player-play-pause"
                        onClick={isPlaying ? pauseTrack : resumeTrack}
                        title={isPlaying ? "Pausar" : "Reproduzir"}
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
                      
                      <button 
                        className="yt-player-control-btn yt-player-next"
                        onClick={skipTrack}
                        title="Próxima música"
                      >
                        ⏭️
                      </button>
                    </div>

                    <div className="yt-player-progress-section">
                      <span className="yt-player-time">
                        {formatTime(currentTime)}
                      </span>
                      
                      <div 
                        className="yt-player-progress-bar"
                        onClick={handleProgressClick}
                      >
                        <div className="yt-player-progress-track"></div>
                        <div 
                          className="yt-player-progress-fill"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                        <div 
                          className="yt-player-progress-thumb"
                          style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                      
                      <span className="yt-player-time">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {searchTerm && !isLoading && searchResults.length === 0 && artistResults.length === 0 && (
          <div className="yt-empty-state">
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente buscar por outro artista, música ou álbum</p>
          </div>
        )}

        {!searchTerm && !isLoading && (
          <div className="yt-empty-state">
            <h3>Comece a explorar</h3>
            <p>Digite algo na barra de pesquisa para descobrir novos artistas e músicas</p>
          </div>
        )}
      </div>

      <audio ref={audioRef} onEnded={handleAudioEnd} />
    </div>
  )
}

export default Search