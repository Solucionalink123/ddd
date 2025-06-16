import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '../hooks/useDatabase'
import { useMusicContext } from '../context/MusicContext'
import { AuthContext } from '../App'

const Library = () => {
  const { user } = useContext(AuthContext)
  const { getUserPlaylists, createPlaylist } = useDatabase()
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [recentTracks, setRecentTracks] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  useEffect(() => {
    // Carregar músicas curtidas do localStorage
    const savedLikes = localStorage.getItem('likedTracks')
    const likedCount = savedLikes ? JSON.parse(savedLikes).length : 0

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
        album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/5e4c8d0b8b9a9d9e8f8d2e6b9a9c7e2f/264x264-000000-80-0-0.jpg" },
        preview: "https://cdns-preview-a.dzcdn.net/stream/c-a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5-6.mp3",
        duration: 245
      },
      {
        id: 2002,
        title: "Weightless",
        artist: { name: "Marconi Union" },
        album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1/264x264-000000-80-0-0.jpg" },
        preview: "https://cdns-preview-b.dzcdn.net/stream/c-b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4-6.mp3",
        duration: 480
      }
    ]

    // Carregar playlists do usuário se logado
    if (user) {
      getUserPlaylists().then(userPlaylists => {
        const defaultPlaylists = [
          { id: 1, name: 'Minhas Curtidas', count: likedCount, image: '❤️', isLikedPlaylist: true, songs: [] },
          { id: 2, name: 'Descobertas da Semana', count: 30, image: '🆕', songs: [] },
          { id: 3, name: 'Playlist Chill', count: chillPlaylist.length, image: '😌', songs: chillPlaylist },
          { id: 4, name: 'Treino', count: trenoPlaylist.length, image: '💪', songs: trenoPlaylist },
        ]

        // Combinar playlists padrão com playlists do usuário
        const allPlaylists = [...defaultPlaylists, ...userPlaylists]
        setPlaylists(allPlaylists)
      })
    } else {
      // Simular playlists criadas pelo usuário para usuários não logados
      setPlaylists([
        { id: 1, name: 'Minhas Curtidas', count: likedCount, image: '❤️', isLikedPlaylist: true, songs: [] },
        { id: 2, name: 'Descobertas da Semana', count: 30, image: '🆕', songs: [] },
        { id: 3, name: 'Playlist Chill', count: chillPlaylist.length, image: '😌', songs: chillPlaylist },
        { id: 4, name: 'Treino', count: trenoPlaylist.length, image: '💪', songs: trenoPlaylist },
      ])
    }

    // Buscar algumas músicas recentes
    const fetchRecentTracks = async () => {
      try {
        const response = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=trending', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        })
        const data = await response.json()
        setRecentTracks(data.data?.slice(0, 8) || [])
      } catch (err) {
        console.error('Erro ao buscar músicas recentes:', err)
      }
    }

    fetchRecentTracks()
  }, [])

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return
    
    try {
      if (user) {
        // Usuário logado - criar playlist no banco
        await createPlaylist(newPlaylistName.trim())
        // Recarregar playlists
        const userPlaylists = await getUserPlaylists()
        const defaultPlaylists = [
          { id: 1, name: 'Minhas Curtidas', count: 0, image: '❤️', isLikedPlaylist: true, songs: [] },
          { id: 2, name: 'Descobertas da Semana', count: 30, image: '🆕', songs: [] },
          { id: 3, name: 'Playlist Chill', count: 2, image: '😌', songs: [] },
          { id: 4, name: 'Treino', count: 5, image: '💪', songs: [] },
        ]
        setPlaylists([...defaultPlaylists, ...userPlaylists])
      } else {
        // Usuário não logado - adicionar localmente
        const newPlaylist = {
          id: Date.now(),
          name: newPlaylistName.trim(),
          count: 0,
          image: '📝',
          songs: []
        }
        setPlaylists([...playlists, newPlaylist])
      }
      
      setNewPlaylistName('')
      setShowCreateModal(false)
    } catch (error) {
      console.error('Erro ao criar playlist:', error)
    }
  }

  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlistTracks, setPlaylistTracks] = useState([])
  const { playTrack, currentTrack, isPlaying } = useMusicContext()

  const handlePlaylistClick = (playlist) => {
    if (playlist.isLikedPlaylist) {
      // Carregar músicas curtidas
      const savedLikes = localStorage.getItem('likedTracks')
      const likedTracks = savedLikes ? JSON.parse(savedLikes) : []
      setPlaylistTracks(likedTracks)
    } else {
      // Usar as músicas da playlist
      setPlaylistTracks(playlist.songs || [])
    }
    setSelectedPlaylist(playlist)
  }

  const handlePlayTrack = (track, index) => {
    playTrack(track, playlistTracks)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ 
      padding: '2rem', 
      background: '#121212', 
      minHeight: 'calc(100vh - 70px)', 
      color: 'white' 
    }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#1db954',
            margin: 0
          }}>
            📚 Sua Biblioteca
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '25px',
              border: 'none',
              background: '#1db954',
              color: 'black',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ➕ Criar Playlist
          </button>
        </div>

        {/* Seção de Playlists */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            color: '#b3b3b3'
          }}>
            Suas Playlists
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {playlists.map((playlist) => (
              <div 
                key={playlist.id}
                style={{
                  background: '#181818',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#282828'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#181818'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {playlist.image}
                </div>
                <h3 style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 0 0.5rem 0'
                }}>
                  {playlist.name}
                </h3>
                <p style={{
                  color: '#b3b3b3',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  {playlist.count} músicas
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Playlist Selecionada */}
        {selectedPlaylist && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem',
              gap: '1rem'
            }}>
              <button
                onClick={() => setSelectedPlaylist(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ←
              </button>
              <div style={{ fontSize: '2rem' }}>{selectedPlaylist.image}</div>
              <div>
                <h2 style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {selectedPlaylist.name}
                </h2>
                <p style={{
                  color: '#b3b3b3',
                  margin: '0.5rem 0 0 0'
                }}>
                  {playlistTracks.length} músicas
                </p>
              </div>
            </div>

            {playlistTracks.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {playlistTracks.map((track, index) => (
                  <div
                    key={track.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                      background: currentTrack?.id === track.id ? 'rgba(29, 185, 84, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (currentTrack?.id !== track.id) {
                        e.currentTarget.style.background = '#2a2a2a'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTrack?.id !== track.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      marginRight: '1rem',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img 
                        src={track.album?.cover_small || track.album?.cover_medium} 
                        alt={track.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {currentTrack?.id === track.id && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0,0,0,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem'
                        }}>
                          {isPlaying ? '⏸️' : '▶️'}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: currentTrack?.id === track.id ? '#1db954' : 'white',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {track.title}
                      </h4>
                      <p style={{
                        color: '#b3b3b3',
                        fontSize: '0.85rem',
                        margin: 0
                      }}>
                        {track.artist?.name}
                      </p>
                    </div>
                    <div style={{
                      color: '#b3b3b3',
                      fontSize: '0.85rem'
                    }}>
                      {formatTime(track.duration)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#b3b3b3'
              }}>
                <p>Nenhuma música nesta playlist ainda.</p>
                {selectedPlaylist.isLikedPlaylist && (
                  <p>Curta algumas músicas para vê-las aqui!</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Seção de Músicas Recentes - só mostrar se não há playlist selecionada */}
        {!selectedPlaylist && (
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              color: '#b3b3b3'
            }}>
              Tocadas Recentemente
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {recentTracks.map((track, index) => (
                <div
                  key={track.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2a2a2a'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '1rem',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={track.album?.cover_small} 
                      alt={track.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {track.title}
                    </h4>
                    <p style={{
                      color: '#b3b3b3',
                      fontSize: '0.85rem',
                      margin: 0
                    }}>
                      {track.artist?.name}
                    </p>
                  </div>
                  <div style={{
                    color: '#b3b3b3',
                    fontSize: '0.85rem'
                  }}>
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Criar Playlist */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#282828',
            padding: '2rem',
            borderRadius: '12px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h2 style={{
              color: 'white',
              marginTop: 0,
              marginBottom: '1.5rem',
              fontSize: '1.5rem'
            }}>
              Criar nova playlist
            </h2>
            
            <input
              type="text"
              placeholder="Nome da playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#404040',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewPlaylistName('')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: '1px solid #535353',
                  background: 'transparent',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: newPlaylistName.trim() ? '#1db954' : '#535353',
                  color: newPlaylistName.trim() ? 'black' : '#b3b3b3',
                  fontSize: '1rem',
                  cursor: newPlaylistName.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}

export default Library