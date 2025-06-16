import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDatabase } from '../hooks/useDatabase'
import './PlaylistView.css'

const PlaylistView = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { playlists } = useDatabase()
  const [playlist, setPlaylist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Buscar playlists padrão com músicas
    const getPlaylistWithSongs = () => {
      // Músicas de exemplo para as playlists
      const trenoPlaylist = [
        {
          id: 1001,
          title: "Eye of the Tiger",
          artist: { name: "Survivor" },
          album: { title: "Eye of the Tiger", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-a.dzcdn.net/stream/c-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6-6.mp3",
          duration: 246
        },
        {
          id: 1002,
          title: "Pump It",
          artist: { name: "Black Eyed Peas" },
          album: { title: "Monkey Business", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-b.dzcdn.net/stream/c-b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7-6.mp3",
          duration: 213
        },
        {
          id: 1003,
          title: "Till I Collapse",
          artist: { name: "Eminem" },
          album: { title: "The Eminem Show", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-c.dzcdn.net/stream/c-c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8-6.mp3",
          duration: 297
        },
        {
          id: 1004,
          title: "Stronger",
          artist: { name: "Kanye West" },
          album: { title: "Graduation", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-d.dzcdn.net/stream/c-d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9-6.mp3",
          duration: 312
        },
        {
          id: 1005,
          title: "Work Out",
          artist: { name: "J. Cole" },
          album: { title: "Cole World", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-e.dzcdn.net/stream/c-e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0-6.mp3",
          duration: 254
        }
      ]

      const chillPlaylist = [
        {
          id: 2001,
          title: "Sunset Lover",
          artist: { name: "Petit Biscuit" },
          album: { title: "Presence", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/5e4c8d0b8b9a9d9e8f8d2e6b9a9c7e2f/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/5e4c8d0b8b9a9d9e8f8d2e6b9a9c7e2f/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-a.dzcdn.net/stream/c-a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5-6.mp3",
          duration: 245
        },
        {
          id: 2002,
          title: "Weightless",
          artist: { name: "Marconi Union" },
          album: { title: "Weightless", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-b.dzcdn.net/stream/c-b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4-6.mp3",
          duration: 480
        },
        {
          id: 2003,
          title: "Midnight City",
          artist: { name: "M83" },
          album: { title: "Hurry Up, We're Dreaming", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2/264x264-000000-80-0-0.jpg", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2/56x56-000000-80-0-0.jpg" },
          preview: "https://cdns-preview-c.dzcdn.net/stream/c-c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5-6.mp3",
          duration: 244
        }
      ]

      // Carregar músicas curtidas do localStorage
      const savedLikes = localStorage.getItem('likedTracks')
      const likedTracks = savedLikes ? JSON.parse(savedLikes) : []

      const defaultPlaylists = [
        { id: '1', name: 'Minhas Curtidas', count: likedTracks.length, image: '❤️', isLikedPlaylist: true, songs: likedTracks },
        { id: '2', name: 'Descobertas da Semana', count: 30, image: '🆕', songs: [] },
        { id: '3', name: 'Playlist Chill', count: chillPlaylist.length, image: '😌', songs: chillPlaylist },
        { id: '4', name: 'Treino', count: trenoPlaylist.length, image: '💪', songs: trenoPlaylist },
      ]

      return defaultPlaylists.find(p => p.id.toString() === playlistId.toString()) || 
             playlists.find(p => p.id.toString() === playlistId.toString())
    }

    const foundPlaylist = getPlaylistWithSongs()
    setPlaylist(foundPlaylist)
  }, [playlistId, playlists])

  const playTrack = (track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!playlist?.songs) return '0 min'
    const totalSeconds = playlist.songs.reduce((total, song) => total + (song.duration || 0), 0)
    const minutes = Math.floor(totalSeconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours} h ${minutes % 60} min`
    }
    return `${minutes} min`
  }

  if (!playlist) {
    return (
      <div style={{ 
        padding: '2rem', 
        background: '#121212', 
        minHeight: '100vh', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>Playlist não encontrada</h2>
        <button 
          onClick={() => navigate('/library')}
          style={{
            padding: '0.8rem 1.5rem',
            borderRadius: '25px',
            border: 'none',
            background: '#1db954',
            color: 'black',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Voltar à Biblioteca
        </button>
      </div>
    )
  }

  return (
    <div className="playlist-view">
      {/* Header da Playlist */}
      <div className="playlist-header">
        <button 
          className="back-button"
          onClick={() => navigate('/library')}
        >
          ← Voltar
        </button>

        <div className="playlist-info">
          <div className="playlist-cover">
            {playlist.image || '🎵'}
          </div>
          <div className="playlist-details">
            <span className="playlist-type">PLAYLIST</span>
            <h1>{playlist.name}</h1>
            <div className="playlist-meta">
              <span>{playlist.songs?.length || 0} músicas</span>
              <span>•</span>
              <span>{getTotalDuration()}</span>
            </div>
          </div>
        </div>

        {playlist.songs?.length > 0 && (
          <div className="playlist-actions">
            <button 
              className="play-all-btn"
              onClick={() => playTrack(playlist.songs[0])}
            >
              ▶ Reproduzir
            </button>
            <button className="shuffle-btn">
              🔀 Aleatório
            </button>
          </div>
        )}
      </div>

      {/* Lista de Músicas */}
      <div className="playlist-content">
        {playlist.songs?.length === 0 ? (
          <div className="empty-playlist">
            <h3>Essa playlist está vazia</h3>
            <p>Encontre algo para tocar</p>
            <button 
              className="search-music-btn"
              onClick={() => navigate('/search')}
            >
              Buscar músicas
            </button>
          </div>
        ) : (
          <div className="tracks-list">
            <div className="tracks-header">
              <span className="track-number">#</span>
              <span className="track-title">TÍTULO</span>
              <span className="track-album">ÁLBUM</span>
              <span className="track-duration">⏱</span>
            </div>

            {playlist.songs?.map((track, index) => (
              <div 
                key={track.id} 
                className={`track-item ${currentTrack?.id === track.id ? 'playing' : ''}`}
                onClick={() => playTrack(track)}
              >
                <span className="track-number">
                  {currentTrack?.id === track.id && isPlaying ? '🔊' : index + 1}
                </span>

                <div className="track-info">
                  <div className="track-cover">
                    <img 
                      src={track.album?.cover_small || track.album?.cover} 
                      alt={track.title}
                    />
                  </div>
                  <div className="track-details">
                    <h4>{track.title}</h4>
                    <p>{track.artist?.name}</p>
                  </div>
                </div>

                <div className="track-album-name">
                  {track.album?.title}
                </div>

                <div className="track-duration">
                  {formatDuration(track.duration)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player fixo no bottom quando uma música está tocando */}
      {currentTrack && (
        <div className="mini-player">
          <div className="player-track-info">
            <img 
              src={currentTrack.album?.cover_small} 
              alt={currentTrack.title}
            />
            <div>
              <h4>{currentTrack.title}</h4>
              <p>{currentTrack.artist?.name}</p>
            </div>
          </div>

          <div className="player-controls">
            <button className="control-btn">⏮</button>
            <button 
              className="play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="control-btn">⏭</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaylistView