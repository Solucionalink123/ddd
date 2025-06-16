import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArtistCarousel.css'

const ArtistCarousel = () => {
  const [artists, setArtists] = useState([])
  const carouselRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchArtists = async () => {
      const artistNames = ['henrique e juliano', 'diego e victor hugo', 'jorge e mateus', 'ze neto e cristiano', 'matheus e kauan', 'gusttavo lima']

      try {
        const artistPromises = artistNames.map(async (artist) => {
          const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${artist}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '51a182675dmsh0fa2875eb748722p1e8a32jsna966d23de03e',
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
          })
          const data = await response.json()
          return data.data[0]?.artist
        })

        const artistsData = await Promise.all(artistPromises)
        setArtists(artistsData.filter(artist => artist))
      } catch (err) {
        console.error(err)
      }
    }

    fetchArtists()
  }, [])

  const handlePlayArtist = (artist, e) => {
    e.stopPropagation()
    alert(`Reproduzindo músicas de ${artist.name}`)
  }

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`)
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

  return (
    <div className="artists-section">
      <div className="section-header-mobile">
        <h2>Recomendado para hoje</h2>
      </div>
      <div className="artist-carousel-container">
        <button className="carousel-nav prev" onClick={scrollLeft}>❮</button>
        <button className="carousel-nav next" onClick={scrollRight}>❯</button>
        <div className="artist-carousel" ref={carouselRef}>
          {artists.map((artist, index) => (
        <div 
          className="artist-card" 
          key={`artist-${artist.id || 'unknown'}-${index}-${artist.name?.replace(/\s+/g, '') || 'unnamed'}`}
          onClick={() => handleArtistClick(artist)}
        >
          <div className="artist-image">
            <img 
              src={artist.picture_medium || artist.picture_big || artist.picture || 'https://via.placeholder.com/250x250?text=No+Image'} 
              alt={artist.name || 'Unknown Artist'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/250x250?text=No+Image'
              }}
            />
            <div className="play-button" onClick={(e) => handlePlayArtist(artist, e)}>▶</div>
          </div>
          <h3>{artist.name || 'Unknown Artist'}</h3>
          <p>Artista</p>
        </div>
      ))}
        </div>
      </div>
    </div>
  )
}

export default ArtistCarousel