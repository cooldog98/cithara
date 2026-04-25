import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import '../styles/LibraryPage.css'
import { CgPlayButtonO } from "react-icons/cg";


const API = 'http://127.0.0.1:8000'

export default function LibraryPage() {
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPlaylistModal, setShowPlaylistModal] = useState(false)
    const [playlists, setPlaylists] = useState([])
    const [selectedSongId, setSelectedSongId] = useState(null)

    useEffect(() => {
        fetchSongs()
    }, [])

    const fetchSongs = async () => {
        try {
            const username = localStorage.getItem('username')
            const res = await axios.get(`${API}/api/songs/?username=${username}`)
            setSongs(res.data.songs)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this song?')) return
        await axios.delete(`${API}/api/songs/delete/${id}/`)
        setSongs(songs.filter(s => s.id !== id))
    }

    const handleShare = (song) => {
        const url = `${window.location.origin}/share/${song.id}`
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
    }

    const formatDate = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ')
        const [day, month, year] = datePart.split('/')
        return new Date(`${year}-${month}-${day}T${timePart}:00Z`)
    }

    const handleAddToPlaylist = async (song) => {
        const username = localStorage.getItem('username')
        const res = await axios.get(`${API}/api/playlists/?username=${username}`)
        setPlaylists(res.data.playlists)
        setSelectedSongId(song.id)
        setShowPlaylistModal(true)
    }

    const handleSelectPlaylist = async (playlistId) => {
        await axios.post(`${API}/api/playlists/${playlistId}/songs/`, { song_id: selectedSongId })
        setShowPlaylistModal(false)
        alert('Added to playlist!')
    }

    const handleDownload = async (audioUrl, title, format) => {
        const res = await fetch(audioUrl)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title}.${format}`  // ← ชื่อเพลง.mp3 หรือ .mp4
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#252525', fontFamily: 'Georgia, serif' }}>
            <Navbar />

            {/* <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}> */}
            <div style={{ flex: 1,overflowY: 'auto', padding: '48px 24px' }}>
                <h1 style={{ fontSize: '35px', color: '#E5DED2', marginBottom: '4px' }}>
                My Library
                </h1>
                <p style={{ color: '#E5DED2', marginBottom: '32px', fontSize: '18px' }}>
                All your generated songs
                </p>

                {loading && <p style={{ color: '#E5DED2' }}>Loading...</p>}

                {!loading && songs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#E5DED2' }}>
                    <p>No songs yet. Go generate your first song!</p>
                </div>
                )}

                {songs.map(song => (
                <div key={song.id} style={{
                    background: '#353535',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 12px rgba(75,57,53,0.1)',
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                }}>
                    {/* picture in left side */}
                    {song.cover_image ? (
                        <img src={song.cover_image} style={{
                            width: 120, height: 100,
                            objectFit: 'cover',
                            borderRadius: 10,
                            flexShrink: 0,
                        }} />
                        ) : (
                        <div style={{
                            width: 120, height: 100,
                            borderRadius: 10,
                            background: '#617891',
                            flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 22,
                        }}>
                            <CgPlayButtonO size={20} color="#E5DED2" />
                        </div>
                    )}

                    {/* info right side */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                            <h3 style={{ color: '#E5DED2', margin: 0, fontSize: '18px' }}>{song.title}</h3>
                            <p style={{ color: '#E5DED2', fontSize: '13px', marginTop: 4 }}>
                                {formatDate(song.created_at).toLocaleString('th-TH', {
                                timeZone: 'Asia/Bangkok', calendar: 'gregory',
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                                })}
                            </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleAddToPlaylist(song)}
                                    className="btn-playlist"
                                    style={{...btnStyle('#617891'), 
                                        transition: 'transform 0.15s, box-shadow 0.15s'
                                    }}
                                >
                                    Add to Playlist
                                </button>

                                <button onClick={() => handleShare(song)}
                                    className="btn-share"
                                    style={{...btnStyle('#617891'), 
                                        transition: 'transform 0.15s, box-shadow 0.15s'
                                    }}
                                >
                                    Share
                                </button>

                                <button onClick={() => handleDelete(song.id)}
                                    className="btn-delete"
                                    style={{...btnStyle('#c0392b'),
                                        transition: 'transform 0.15s, box-shadow 0.15s'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {song.audio_url && (
                            <div>
                                <audio controls src={song.audio_url} style={{ width: '100%' }} />
                                <select onChange={(e) => {
                                    if (e.target.value) {
                                        handleDownload(song.audio_url, song.title, e.target.value)
                                        e.target.value = ''
                                    }
                                }} style={{
                                    background: '#353535',
                                    color: '#E5DED2',
                                    border: '1px solid #617891',
                                    borderRadius: 6,
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    marginTop: 8,
                                }}>
                                    <option value="">⬇ Download</option>
                                    <option value="mp3">Download MP3</option>
                                    <option value="mp4">Download MP4</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {!song.audio_url && (
                    <p style={{ color: '#E5DED2', fontSize: '13px', marginTop: 8 }}>
                        Still generating...
                    </p>
                    )}
                </div>
                ))}
            </div>
            {showPlaylistModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: '#353535', borderRadius: 16, padding: 32, width: 360 }}>
                        <h2 style={{ color: '#E5DED2', marginBottom: 16 }}>Add to Playlist</h2>
                        {playlists.map(p => (
                            <div key={p.id} onClick={() => handleSelectPlaylist(p.id)} 
                                className='btn-addplay'
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px', borderRadius: 8, cursor: 'pointer',
                                    marginBottom: 8, background: 'rgba(97,120,145,0.2)',
                                }}
                            >
                                {p.cover_image ? (
                                    <img src={p.cover_image} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: 44, 
                                            height: 44, 
                                            borderRadius: 8, 
                                            background: '#617891', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}
                                    >
                                        <CgPlayButtonO size={20} color="#E5DED2" />
                                    </div>
                                )}
                                <span style={{ color: '#E5DED2' }}>{p.name}</span>
                            </div>
                        ))}
                        <button onClick={() => setShowPlaylistModal(false)} 
                            className='btn-cancen'
                            style={{ marginTop: 8, 
                                width: '100%', 
                                padding: 10, 
                                background: 'transparent', 
                                border: '1px solid #617891', 
                                color: '#E5DED2', 
                                borderRadius: 8, 
                                cursor: 'pointer' 
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// #617891
// #E5DED2
// #353535

const btnStyle = (bg) => ({
  padding: '6px 14px',
  background: bg,
  color: '#E5DED2',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
})