
// Database usando localStorage para simular um banco de dados
class Database {
  constructor() {
    this.users = this.getFromStorage('users') || []
    this.playlists = this.getFromStorage('playlists') || []
    this.favorites = this.getFromStorage('favorites') || []
  }

  // Métodos auxiliares para localStorage
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error)
      return null
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  // Métodos de usuário
  async createUser(userData) {
    try {
      // Reload users from storage to get latest data
      this.users = this.getFromStorage('users') || []
      
      const existingUser = this.users.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        plan: userData.plan || 'free',
        avatar: userData.avatar,
        createdAt: new Date().toISOString(),
        isPremium: userData.plan === 'premium'
      }

      this.users.push(newUser)
      this.saveToStorage('users', this.users)
      console.log('User created:', newUser)
      return newUser
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  async authenticateUser(email, password) {
    try {
      // Reload users from storage to get latest data
      this.users = this.getFromStorage('users') || []
      console.log('Available users:', this.users)
      console.log('Trying to login with:', { email, password })
      
      const user = this.users.find(u => u.email === email && u.password === password)
      if (!user) {
        console.log('No user found with these credentials')
        return null
      }
      
      console.log('User authenticated:', user)
      return user
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  async updateUser(userId, updates) {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado')
      }

      this.users[userIndex] = { ...this.users[userIndex], ...updates }
      this.saveToStorage('users', this.users)
      return this.users[userIndex]
    } catch (error) {
      throw error
    }
  }

  // Métodos de favoritos
  async addToFavorites(userId, music) {
    try {
      const favorite = {
        id: Date.now().toString(),
        userId,
        musicId: music.id,
        musicData: music,
        addedAt: new Date().toISOString()
      }

      this.favorites.push(favorite)
      this.saveToStorage('favorites', this.favorites)
      return favorite
    } catch (error) {
      throw error
    }
  }

  async removeFromFavorites(userId, musicId) {
    try {
      this.favorites = this.favorites.filter(f => 
        !(f.userId === userId && f.musicId === musicId)
      )
      this.saveToStorage('favorites', this.favorites)
      return true
    } catch (error) {
      throw error
    }
  }

  async getUserFavorites(userId) {
    try {
      return this.favorites.filter(f => f.userId === userId)
    } catch (error) {
      throw error
    }
  }

  async isFavorite(userId, musicId) {
    try {
      return this.favorites.some(f => f.userId === userId && f.musicId === musicId)
    } catch (error) {
      return false
    }
  }

  // Métodos de playlist
  async createPlaylist(userId, name) {
    try {
      // Reload playlists from storage to get latest data
      this.playlists = this.getFromStorage('playlists') || []
      
      const playlist = {
        id: Date.now().toString(),
        userId,
        name,
        songs: [],
        image: '🎵',
        createdAt: new Date().toISOString()
      }

      this.playlists.push(playlist)
      this.saveToStorage('playlists', this.playlists)
      console.log('Playlist criada:', playlist)
      return playlist
    } catch (error) {
      console.error('Error creating playlist:', error)
      throw error
    }
  }

  async getUserPlaylists(userId) {
    try {
      // Reload playlists from storage to get latest data
      this.playlists = this.getFromStorage('playlists') || []
      return this.playlists.filter(p => p.userId === userId)
    } catch (error) {
      console.error('Error getting user playlists:', error)
      return []
    }
  }

  async addToPlaylist(playlistId, music) {
    try {
      // Reload playlists from storage to get latest data
      this.playlists = this.getFromStorage('playlists') || []
      
      const playlistIndex = this.playlists.findIndex(p => p.id.toString() === playlistId.toString())
      if (playlistIndex === -1) {
        throw new Error('Playlist não encontrada')
      }

      const playlist = this.playlists[playlistIndex]
      
      // Inicializar songs se não existir
      if (!playlist.songs) {
        playlist.songs = []
      }
      
      // Verificar se a música já existe na playlist
      const existingSong = playlist.songs.find(s => s.id.toString() === music.id.toString())
      if (existingSong) {
        console.log('Música já existe na playlist')
        return playlist
      }
      
      const musicData = {
        id: music.id,
        title: music.title,
        artist: music.artist,
        album: music.album,
        preview: music.preview,
        duration: music.duration || 30,
        addedAt: new Date().toISOString()
      }
      
      playlist.songs.push(musicData)
      this.playlists[playlistIndex] = playlist
      this.saveToStorage('playlists', this.playlists)
      console.log('Música adicionada à playlist:', musicData.title, 'na playlist:', playlist.name)

      return playlist
    } catch (error) {
      console.error('Database addToPlaylist error:', error)
      throw error
    }
  }

  // Métodos de histórico
  async addToHistory(userId, music) {
    try {
      const history = this.getFromStorage('history') || []
      
      // Remove a música se já existe no histórico
      const filteredHistory = history.filter(h => 
        !(h.userId === userId && h.musicId === music.id)
      )
      
      const historyItem = {
        id: Date.now().toString(),
        userId,
        musicId: music.id,
        musicData: music,
        playedAt: new Date().toISOString()
      }

      // Adiciona no início da lista
      filteredHistory.unshift(historyItem)
      
      // Mantém apenas os últimos 50 itens por usuário
      const userHistory = filteredHistory.filter(h => h.userId === userId).slice(0, 50)
      const otherUsersHistory = filteredHistory.filter(h => h.userId !== userId)
      
      this.saveToStorage('history', [...userHistory, ...otherUsersHistory])
      return historyItem
    } catch (error) {
      throw error
    }
  }

  async getUserHistory(userId) {
    try {
      const history = this.getFromStorage('history') || []
      return history.filter(h => h.userId === userId)
    } catch (error) {
      throw error
    }
  }
}

export default Database
