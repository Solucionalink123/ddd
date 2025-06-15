import { useState, useContext, useEffect } from 'react'
import Database from '../database/database'
import { AuthContext } from '../App'

export const useDatabase = () => {
  const { user } = useContext(AuthContext)
  const [db] = useState(() => new Database())
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setFavorites([])
      setPlaylists([])
      setHistory([])
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const userFavorites = await getUserFavorites()
      const userPlaylists = await getUserPlaylists()
      const userHistory = await getUserHistory()

      setFavorites(userFavorites || [])
      setPlaylists(userPlaylists || [])
      setHistory(userHistory || [])
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const registerUser = async (userData) => {
    try {
      return await db.createUser(userData)
    } catch (error) {
      throw error
    }
  }

  const loginUser = async (email, password) => {
    try {
      return await db.authenticateUser(email, password)
    } catch (error) {
      throw error
    }
  }

  const addToFavorites = async (music) => {
    if (!user) return
    try {
      const result = await db.addToFavorites(user.id, music)
      if (result) {
        setFavorites(await getUserFavorites())
      }
      return result
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error)
      throw error
    }
  }

  const removeFromFavorites = async (musicId) => {
    if (!user) return false
    try {
      const result = await db.removeFromFavorites(user.id, musicId)
      if (result) {
        setFavorites(await getUserFavorites())
      }
      return result
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error)
      return false
    }
  }

  const getUserFavorites = async () => {
    if (!user) return []
    try {
      return await db.getUserFavorites(user.id)
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return []
    }
  }

  const isFavorite = (musicId) => {
    if (!user) return false
    try {
      return favorites.some(fav => fav.musicId.toString() === musicId.toString())
    } catch (error) {
      console.error('Erro ao verificar favorito:', error)
      return false
    }
  }

  const createPlaylist = async (name) => {
    if (!user) return null
    try {
      const playlist = await db.createPlaylist(user.id, name)
      setPlaylists(await getUserPlaylists())
      return playlist
    } catch (error) {
      console.error('Erro ao criar playlist:', error)
      throw error
    }
  }

  const getUserPlaylists = async () => {
    if (!user) return []
    try {
      setIsLoading(true)
      const userPlaylists = await db.getUserPlaylists(user.id)
      return userPlaylists || []
    } catch (error) {
      console.error('Erro ao buscar playlists:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const addToPlaylist = async (playlistId, music) => {
    if (!user) return null
    try {
      const result = await db.addToPlaylist(playlistId, music)
      if (result) {
        setPlaylists(await getUserPlaylists())
      }
      return result
    } catch (error) {
      console.error('Erro ao adicionar à playlist:', error)
      throw error
    }
  }

  const getUserHistory = async () => {
    if (!user) return []
    try {
      return await db.getUserHistory(user.id)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      return []
    }
  }

  const addToHistory = async (music) => {
    if (!user) return
    try {
      const result = await db.addToHistory(user.id, music)
      if (result) {
        setHistory(await getUserHistory())
      }
      return result
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error)
      throw error
    }
  }

  return {
    registerUser,
    loginUser,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    isFavorite,
    createPlaylist,
    getUserPlaylists,
    addToPlaylist,
    getUserHistory,
    addToHistory,
    favorites,
    playlists,
    history,
    isLoading
  }
}