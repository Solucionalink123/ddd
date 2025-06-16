
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { useMusicContext } from '../context/MusicContext'
import { useDatabase } from '../hooks/useDatabase'
import LyricsModal from '../components/LyricsModal'
import './ArtistView.css'

const ArtistView = () => {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { playTrack: globalPlayTrack, currentTrack, isPlaying } = useMusicContext()
  const { addToFavorites, removeFromFavorites, isFavorite, addToHistory, getUserPlaylists, addToPlaylist, createPlaylist } = useDatabase()
  
  const [artist, setArtist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLyricsOpen, setIsLyricsOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState(null)
  const [userPlaylists, setUserPlaylists] = useState([])
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return

      try {
        setLoading(true)
        
        // Buscar informações do artista e suas músicas
        const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        })
        const artistData = await response.json()
        setArtist(artistData)

        // Buscar top tracks do artista
        const tracksResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}/top?limit=50`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        })
        const tracksData = await tracksResponse.json()
        let artistTracks = tracksData.data || []

        // Se não encontrou músicas, buscar por nome do artista
        if (artistTracks.length === 0 && artistData.name) {
          try {
            const searchResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(artistData.name)}&limit=20`, {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
              }
            })
            const searchData = await searchResponse.json()
            artistTracks = (searchData.data || []).filter(track => 
              track.artist && track.artist.id === artistData.id
            )
          } catch (searchError) {
            console.error('Erro na busca por nome do artista:', searchError)
          }
        }

        // Buscar músicas populares adicionais baseadas no nome do artista
        if (artistData.name) {
          try {
            const popularSongs = [
              'golden hour part 3',
              'this is what falling in love feels like',
              'this is what winter feels like',
              'this is what autumn feels like'
            ]

            for (const song of popularSongs) {
              try {
                const songResponse = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(song)}&limit=5`, {
                  method: 'GET',
                  headers: {
                    'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
                    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                  }
                })
                const songData = await songResponse.json()
                const songTracks = songData.data || []
                
                songTracks.forEach(track => {
                  const isAlreadyAdded = artistTracks.some(existingTrack => existingTrack.id === track.id)
                  if (!isAlreadyAdded && 
                      (track.artist?.name.toLowerCase().includes(artistData.name.toLowerCase()) ||
                       artistData.name.toLowerCase().includes(track.artist?.name.toLowerCase()) ||
                       track.title.toLowerCase().includes(song.toLowerCase()))) {
                    artistTracks.push(track)
                  }
                })
              } catch (songError) {
                console.error(`Erro ao buscar ${song}:`, songError)
              }
            }
          } catch (popularError) {
            console.error('Erro ao buscar músicas populares:', popularError)
          }
        }

        setTracks(artistTracks)
        
      } catch (error) {
        console.error('Erro ao buscar dados do artista:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [artistId])

  useEffect(() => {
    const loadPlaylists = async () => {
      if (user) {
        try {
          const userPlaylistsData = await getUserPlaylists()
          setUserPlaylists(userPlaylistsData || [])
        } catch (error) {
          console.error('Erro ao carregar playlists:', error)
          setUserPlaylists([])
        }
      }
    }

    loadPlaylists()
  }, [user])

  const playTrack = (track) => {
    globalPlayTrack(track)

    if (user) {
      const songData = {
        song_id: track.id.toString(),
        song_title: track.title,
        artist_name: track.artist.name,
        album_cover: track.album.cover_medium,
        preview_url: track.preview
      }
      addToHistory(songData)
    }
  }

  const handleFavorite = async (track, e) => {
    e.stopPropagation()

    if (!user) {
      alert('Faça login para adicionar favoritos!')
      return
    }

    const songData = {
      song_id: track.id.toString(),
      song_title: track.title,
      artist_name: track.artist.name,
      album_cover: track.album.cover_medium,
      preview_url: track.preview
    }

    if (isFavorite(track.id.toString())) {
      const success = await removeFromFavorites(track.id.toString())
      if (success) {
        alert('Removido dos favoritos!')
      }
    } else {
      const success = await addToFavorites(songData)
      if (success) {
        alert('Adicionado aos favoritos!')
      }
    }
  }

  const showLyrics = (track) => {
    setSelectedTrack(track)
    setIsLyricsOpen(true)
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const openPlaylistModal = (track) => {
    if (!user) {
      alert('Faça login para adicionar músicas às playlists')
      return
    }
    setShowPlaylistModal(track)
  }

  const handleAddToPlaylist = async (playlist, track) => {
    try {
      const songData = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        preview: track.preview,
        duration: track.duration || 30
      }

      const result = await addToPlaylist(playlist.id, songData)
      if (result) {
        alert(`"${track.title}" foi adicionada à playlist "${playlist.name}"`)
        const updatedPlaylists = await getUserPlaylists()
        setUserPlaylists(updatedPlaylists || [])
      }
      setShowPlaylistModal(null)
    } catch (error) {
      console.error('Erro ao adicionar à playlist:', error)
      alert('Erro ao adicionar música à playlist')
    }
  }

  const handleCreateNewPlaylist = async () => {
    if (!newPlaylistName.trim()) return

    try {
      const newPlaylist = await createPlaylist(newPlaylistName.trim())
      if (newPlaylist) {
        const updatedPlaylists = await getUserPlaylists()
        setUserPlaylists(updatedPlaylists || [])

        if (showPlaylistModal) {
          await handleAddToPlaylist(newPlaylist, showPlaylistModal)
        }
      }
      setNewPlaylistName('')
      setShowCreatePlaylistModal(false)
    } catch (error) {
      console.error('Erro ao criar playlist:', error)
      alert('Erro ao criar nova playlist')
    }
  }

  if (loading) {
    return (
      <div className="artist-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="artist-view">
        <div className="error">
          <h2>Artista não encontrado</h2>
          <button onClick={() => navigate(-1)} className="back-btn">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="artist-view">
      {/* Header */}
      <div className="artist-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Voltar
        </button>
        
        <div className="artist-info">
          <div className="artist-image">
            <img 
              src={artist.picture_big || artist.picture_medium || artist.picture} 
              alt={artist.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
              }}
            />
          </div>
          
          <div className="artist-details">
            <p className="artist-type">Artista</p>
            <h1>{artist.name}</h1>
            <div className="artist-stats">
              <span>{artist.nb_fan?.toLocaleString() || 0} ouvintes mensais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="tracks-section">
        <div className="section-header">
          <h2>Populares</h2>
        </div>

        <div className="tracks-list">
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <div 
                key={`${track.id}-${index}`} 
                className="track-item"
                onClick={() => playTrack(track)}
              >
                <div className="track-number">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="playing-indicator">♪</div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="track-info">
                  <img 
                    src={track.album?.cover_small || track.album?.cover_medium || track.album?.cover || 'https://via.placeholder.com/56x56?text=No+Image'} 
                    alt={track.title || 'Unknown Track'}
                    className="track-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/56x56?text=No+Image'
                    }}
                  />
                  <div className="track-details">
                    <h4>{track.title || 'Título Desconhecido'}</h4>
                    <p>{track.artist?.name || 'Artista Desconhecido'}</p>
                  </div>
                </div>

                <div className="track-album">
                  <span>{track.album?.title || 'Álbum Desconhecido'}</span>
                </div>

                <div className="track-actions">
                  <button
                    className={`favorite-btn ${user && isFavorite(track.id.toString()) ? 'favorited' : ''}`}
                    onClick={(e) => handleFavorite(track, e)}
                    title={user ? (isFavorite(track.id.toString()) ? 'Remover dos favoritos' : 'Adicionar aos favoritos') : 'Faça login para favoritar'}
                  >
                    {user && isFavorite(track.id.toString()) ? '❤️' : '🤍'}
                  </button>

                  <button
                    className="playlist-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openPlaylistModal(track)
                    }}
                    title="Adicionar à playlist"
                  >
                    ➕
                  </button>

                  <button
                    className="lyrics-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      showLyrics(track)
                    }}
                    title="Ver letra"
                  >
                    📝
                  </button>
                </div>

                <div className="track-duration">
                  <span>{formatDuration(track.duration || 30)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tracks">
              <p>Carregando músicas do artista...</p>
              <p>Aguarde enquanto buscamos as melhores faixas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Adicionar à playlist</h2>
              <button
                onClick={() => setShowPlaylistModal(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="selected-track">
              <img 
                src={showPlaylistModal.album?.cover_small || showPlaylistModal.album?.cover} 
                alt={showPlaylistModal.title}
              />
              <div>
                <h4>{showPlaylistModal.title}</h4>
                <p>{showPlaylistModal.artist?.name}</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreatePlaylistModal(true)}
              className="create-playlist-btn"
            >
              + Criar nova playlist
            </button>

            <div className="playlists-list">
              {userPlaylists && userPlaylists.length > 0 ? (
                userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist, showPlaylistModal)}
                    className="playlist-item"
                  >
                    <div className="playlist-icon">
                      {playlist.image || '🎵'}
                    </div>
                    <div className="playlist-info">
                      <div className="playlist-name">{playlist.name}</div>
                      <div className="playlist-count">
                        {playlist.songs?.length || 0} música{(playlist.songs?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-playlists">
                  <div>🎵</div>
                  <p>Você ainda não tem playlists</p>
                  <p>Crie sua primeira playlist para organizar suas músicas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreatePlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h2>Nova playlist</h2>

            <input
              type="text"
              placeholder="Nome da playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewPlaylist()}
              autoFocus
            />

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowCreatePlaylistModal(false)
                  setNewPlaylistName('')
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewPlaylist}
                disabled={!newPlaylistName.trim()}
                className="create-btn"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics Modal */}
      <LyricsModal 
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        track={selectedTrack}
      />
    </div>
  )
}

export default ArtistView
