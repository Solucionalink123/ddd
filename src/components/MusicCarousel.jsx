import React, { useState, useEffect, useRef, useContext } from 'react'
import { AuthContext } from '../App'
import { useMusicContext } from '../context/MusicContext'
import { useDatabase } from '../hooks/useDatabase'
import LyricsModal from './LyricsModal'
import './MusicCarousel.css'

const MusicCarousel = ({ title, genre }) => {
  const { user } = useContext(AuthContext)
  const { playTrack: globalPlayTrack, currentTrack, isPlaying } = useMusicContext()
  const { playlists, addToPlaylist, addToFavorites, removeFromFavorites, isFavorite, addToHistory, createPlaylist, getUserPlaylists } = useDatabase()
  const [tracks, setTracks] = useState([])
  const [isLyricsOpen, setIsLyricsOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState(null)
  const [userPlaylists, setUserPlaylists] = useState([])
  const [likedTracks, setLikedTracks] = useState([])
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const carouselRef = useRef(null)

  useEffect(() => {
    const fetchMusic = async () => {
      // Define artistas por gênero com mais variedade
      const genreArtists = {
        rock: ['queen', 'led zeppelin', 'the beatles', 'nirvana', 'pink floyd', 'ac dc', 'metallica', 'guns n roses', 'rolling stones', 'black sabbath', 'deep purple', 'iron maiden', 'pearl jam', 'red hot chili peppers', 'foo fighters', 'green day', 'radiohead', 'u2', 'the who', 'aerosmith'],
        pop: ['taylor swift', 'ariana grande', 'dua lipa', 'ed sheeran', 'billie eilish', 'olivia rodrigo', 'harry styles', 'the weeknd', 'bruno mars', 'adele', 'justin bieber', 'selena gomez', 'miley cyrus', 'katy perry', 'lady gaga', 'rihanna', 'sia', 'charlie puth', 'shawn mendes', 'camila cabello'],
        hip_hop: ['drake', 'kendrick lamar', 'travis scott', 'post malone', 'eminem', 'kanye west', 'j cole', 'future', 'lil wayne', 'jay z', 'nas', 'biggie', 'tupac', 'nicki minaj', 'cardi b', 'migos', 'lil baby', 'dababy', 'roddy ricch', 'tyler the creator'],
        eletronica: ['calvin harris', 'david guetta', 'marshmello', 'martin garrix', 'deadmau5', 'skrillex', 'avicii', 'tiesto', 'diplo', 'zedd', 'alan walker', 'swedish house mafia', 'flume', 'porter robinson', 'daft punk', 'disclosure', 'odesza', 'illenium', 'chainsmokers', 'major lazer'],
        sertanejo: ['henrique e juliano', 'jorge e mateus', 'ze neto e cristiano', 'matheus e kauan', 'gusttavo lima', 'diego e victor hugo', 'simone e simaria', 'anitta', 'marilia mendonca', 'wesley safadao', 'luan santana', 'bruno e marrone', 'zeze di camargo e luciano', 'leonardo', 'chitaozinho e xororo', 'eduardo costa', 'cristiano araujo', 'victor e leo'],
        reggae: ['bob marley', 'jimmy cliff', 'damian marley', 'ziggy marley', 'stephen marley', 'burning spear', 'peter tosh', 'steel pulse', 'gregory isaacs', 'dennis brown', 'culture', 'third world', 'israel vibration', 'black uhuru', 'toots and the maytals', 'lee scratch perry', 'alpha blondy', 'lucky dube'],
        jazz: ['miles davis', 'john coltrane', 'louis armstrong', 'ella fitzgerald', 'charlie parker', 'duke ellington', 'billie holiday', 'thelonious monk', 'nina simone', 'frank sinatra', 'nat king cole', 'count basie', 'benny goodman', 'dizzy gillespie', 'art tatum', 'herbie hancock', 'weather report', 'chick corea'],
        funk: ['mc kevinho', 'anitta', 'ludmilla', 'mc don juan', 'mc hariel', 'mc davi', 'mc theuzyn', 'mc ryan sp', 'mc ig', 'mc pedrinho', 'mc zaac', 'mc loma', 'mc rebecca', 'mc mirella', 'mc carol', 'valesca popozuda', 'tati quebra barraco', 'mc bin laden', 'mc livinho', 'mc guime']
      }

      // Seleciona artistas baseado no gênero ou usa pop como padrão
      const artists = genreArtists[genre] || genreArtists.pop
      
      // Busca por múltiplos artistas diferentes para maior variedade
      const shuffledArtists = [...artists].sort(() => 0.5 - Math.random())
      const selectedArtists = shuffledArtists.slice(0, 3) // Pega 3 artistas diferentes
      
      try {
        const allTracks = []
        
        // Faz busca para cada artista selecionado
        for (const artist of selectedArtists) {
          const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${artist}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
          })
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            // Pega até 4 músicas de cada artista
            allTracks.push(...data.data.slice(0, 4))
          }
        }
        
        // Embaralha todas as músicas e pega as primeiras 12
        const shuffledTracks = allTracks.sort(() => 0.5 - Math.random())
        setTracks(shuffledTracks.slice(0, 12))
        
      } catch (err) {
        console.error('Error fetching tracks:', err)
      }
    }

    fetchMusic()
  }, [genre])

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
      } else {
        setUserPlaylists([])
      }
    }

    loadPlaylists()
  }, [user])

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const playTrack = (track) => {
    globalPlayTrack(track, tracks)

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

  const showLyrics = (track) => {
    setSelectedTrack(track)
    setIsLyricsOpen(true)
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
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

  const openPlaylistModal = (track) => {
    if (!user) {
      alert('Faça login para adicionar músicas às playlists')
      return
    }
    setShowPlaylistModal(track)
  }

  return (
    <div className="music-section">
      <div className="section-header">
        <h2>{title || 'Músicas Recomendadas'}</h2>
        <button className="show-all">Mostrar tudo</button>
      </div>



      <div className="music-carousel-container">
        <button className="carousel-nav prev" onClick={scrollLeft}>❮</button>
        <button className="carousel-nav next" onClick={scrollRight}>❯</button>
        <div className="music-carousel" ref={carouselRef}>
          {tracks.map((track, index) => (
            <div className="music-card" key={track.id}>
              <div className="music-image">
                <img 
                  src={track.album.cover_medium || track.album.cover_big || track.album.cover || 'https://via.placeholder.com/250x250?text=No+Image'} 
                  alt={track.title || 'Unknown Track'}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/250x250?text=No+Image'
                  }}
                />
                <div
                  className="play-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    playTrack(track)
                  }}
                >
                  {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                </div>
              </div>
              <h3>{track.title}</h3>
              <p>{track.artist.name}</p>
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


            </div>
          ))}
        </div>
      </div>

      {showPlaylistModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#282828',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                color: 'white',
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                Adicionar à playlist
              </h2>
              <button
                onClick={() => setShowPlaylistModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#b3b3b3',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#b3b3b3'
                }}
              >
                ×
              </button>
            </div>

            {/* Música Selecionada */}
            <div style={{
              background: '#181818',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img 
                src={showPlaylistModal.album?.cover_small || showPlaylistModal.album?.cover} 
                alt={showPlaylistModal.title}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  color: 'white',
                  margin: '0 0 0.25rem 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {showPlaylistModal.title}
                </h4>
                <p style={{
                  color: '#b3b3b3',
                  margin: 0,
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {showPlaylistModal.artist?.name}
                </p>
              </div>
            </div>

            {/* Botão Criar Nova Playlist */}
            <button
              onClick={() => setShowCreatePlaylistModal(true)}
              style={{
                width: '100%',
                background: '#1db954',
                border: 'none',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '1rem',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1ed760'}
              onMouseLeave={(e) => e.target.style.background = '#1db954'}
            >
              + Criar nova playlist
            </button>

            {/* Lista de Playlists */}
            <div style={{
              overflowY: 'auto',
              maxHeight: '300px',
              flex: 1
            }}>
              {userPlaylists && userPlaylists.length > 0 ? (
                userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist, showPlaylistModal)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.5rem',
                      transition: 'background 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#404040'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      minWidth: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}>
                      {playlist.image || '🎵'}
                    </div>
                    <div style={{
                      flex: 1,
                      minWidth: 0
                    }}>
                      <div style={{
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        fontSize: '0.95rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {playlist.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#b3b3b3'
                      }}>
                        {playlist.songs?.length || 0} música{(playlist.songs?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#b3b3b3',
                  padding: '2rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎵</div>
                  <p style={{ margin: '0 0 1rem 0' }}>Você ainda não tem playlists</p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>Crie sua primeira playlist para organizar suas músicas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreatePlaylistModal && (
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
          zIndex: 1001,
          padding: '20px'
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
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Nova playlist
            </h2>

            <input
              type="text"
              placeholder="Nome da playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewPlaylist()}
              autoFocus
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#404040',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowCreatePlaylistModal(false)
                  setNewPlaylistName('')
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #535353',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.borderColor = '#727272'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.borderColor = '#535353'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewPlaylist}
                disabled={!newPlaylistName.trim()}
                style={{
                  background: newPlaylistName.trim() ? '#1db954' : '#535353',
                  border: 'none',
                  color: newPlaylistName.trim() ? 'black' : '#b3b3b3',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: newPlaylistName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (newPlaylistName.trim()) {
                    e.target.style.background = '#1ed760'
                  }
                }}
                onMouseLeave={(e) => {
                  if (newPlaylistName.trim()) {
                    e.target.style.background = '#1db954'
                  }
                }}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      <LyricsModal 
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        track={selectedTrack}
      />
    </div>
  )
}

export default MusicCarousel