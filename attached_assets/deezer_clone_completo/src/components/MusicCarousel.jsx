import React, { useEffect, useState } from 'react'
import './MusicCarousel.css'

const MusicCarousel = () => {
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'YOUR_API_KEY',
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
      }
    })
      .then(response => response.json())
      .then(data => setTracks(data.data.slice(0, 10)))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="carousel">
      {tracks.map((track) => (
        <div className="track" key={track.id}>
          <img src={track.album.cover_medium} alt={track.title} />
          <p>{track.title}</p>
          <audio controls src={track.preview}></audio>
        </div>
      ))}
    </div>
  )
}

export default MusicCarousel