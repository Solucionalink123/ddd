import React, { useState, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MusicProvider } from './context/MusicContext'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import PlaylistView from './pages/PlaylistView'
import ArtistView from './pages/ArtistView'
import Premium from './pages/Premium'
import Support from './pages/Support'  
import Download from './pages/Download'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GlobalMusicPlayer from './components/GlobalMusicPlayer'
import './App.css'

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setUser: () => {}
})

const App = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      <MusicProvider>
        <Router>
          <div className="app">
            <div className="app-layout">
              <Sidebar />
              <div className="main-wrapper">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/playlist/:playlistId" element={<PlaylistView />} />
                  <Route path="/artist/:artistId" element={<ArtistView />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/download" element={<Download />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </div>
            </div>
            <GlobalMusicPlayer />
          </div>
        </Router>
      </MusicProvider>
    </AuthContext.Provider>
  )
}

export default App