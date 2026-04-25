import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import LoginPage from './pages/Dashbord'
import GeneratePage from './pages/GeneratePage'
import DashbordPage from './pages/Dashbord'
import LibraryPage from './pages/LibraryPage'
import PlaylistsPage from './pages/PlaylistsPage'
import PlaylistDetailPage from './pages/PlaylistDetailPage'
import { PlayerProvider } from './context/PlayerContext'
import SharePage from './pages/SharePage'

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashbordPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/share/:id" element={<SharePage />} />
        </Routes>
      </BrowserRouter>
      </PlayerProvider>
  )
}