import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDatabase } from '../hooks/useDatabase'
import { useMusicContext } from '../context/MusicContext' // ⬅️ import do contexto
import './PlaylistView.css'

const PlaylistView = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { playlists } = useDatabase()
  const { currentTrack, isPlaying, playTrack } = useMusicContext() // ⬅️ usar o contexto aqui
  const [playlist, setPlaylist] = useState(null)

  useEffect(() => {
    const getPlaylistWithSongs = () => {
      const savedLikes = localStorage.getItem('likedTracks')
      const likedTracks = savedLikes ? JSON.parse(savedLikes) : []

      const chillPlaylist = [/*...*/] // você pode manter como já está
      const trenoPlaylist = [/*...*/] // idem

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
    return hours > 0 ? `${hours} h ${minutes % 60} min` : `${minutes} min`
  }

  if (!playlist) {
    return (
      <div className="playlist-view error">
        <h2>Playlist não encontrada</h2>
        <button onClick={() => navigate('/library')}>Voltar à Biblioteca</button>
      </div>
    )
  }

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <button onClick={() => navigate('/library')} className="back-button">← Voltar</button>

        <div className="playlist-info">
          <div className="playlist-cover">{playlist.image || '🎵'}</div>
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
            <button onClick={() => playTrack(playlist.songs[0], playlist.songs)} className="play-all-btn">
              ▶ Reproduzir
            </button>
            <button className="shuffle-btn">🔀 Aleatório</button>
          </div>
        )}
      </div>

      <div className="playlist-content">
        {playlist.songs?.length === 0 ? (
          <div className="empty-playlist">
            <h3>Essa playlist está vazia</h3>
            <button onClick={() => navigate('/search')}>Buscar músicas</button>
          </div>
        ) : (
          <div className="tracks-list">
            <div className="tracks-header">
              <span>#</span>
              <span>TÍTULO</span>
              <span>ÁLBUM</span>
              <span>⏱</span>
            </div>

            {playlist.songs.map((track, index) => (
              <div 
                key={track.id} 
                className={`track-item ${currentTrack?.id === track.id ? 'playing' : ''}`}
                onClick={() => playTrack(track, playlist.songs)} // ⬅️ passa a playlist completa
              >
                <span>{currentTrack?.id === track.id && isPlaying ? '🔊' : index + 1}</span>
                <div className="track-info">
                  <img src={track.album?.cover_small} alt={track.title} />
                  <div>
                    <h4>{track.title}</h4>
                    <p>{track.artist?.name}</p>
                  </div>
                </div>
                <div className="track-album-name">{track.album?.title}</div>
                <div className="track-duration">{formatDuration(track.duration)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistView