import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { FiPlay, FiPause } from 'react-icons/fi'
import { CgPlayButtonO } from "react-icons/cg"
import { usePlayer } from '../context/PlayerContext'
import '../styles/PlaylistDetailPage.css'


const API = 'http://127.0.0.1:8000'
const res = await axios.get(`${API}/api/songs/`)

export default function PlaylistDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [playlist, setPlaylist] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showAddSongs, setShowAddSongs] = useState(false)
    const [allSongs, setAllSongs] = useState([])

    // use global player insate local
    const { currentSong, isPlaying, playSong, togglePlay } = usePlayer()

    useEffect(() => {
        axios.get(`${API}/api/playlists/${id}/`).then(res => setPlaylist(res.data))
    }, [id])

    const fetchAllSongs = async () => {
        const username = localStorage.getItem('username')
        const res = await axios.get(`${API}/api/songs/?username=${username}`)
        setAllSongs(res.data.songs)
    }

    const handleAddSong = async (songId) => {
        await axios.post(`${API}/api/playlists/${id}/songs/`, { song_id: songId })
        const res = await axios.get(`${API}/api/playlists/${id}/`)
        setPlaylist(res.data)
    }

    const handleRemoveSong = async (songId) => {
        await axios.delete(`${API}/api/playlists/${id}/songs/`, { data: { song_id: songId } })
        const res = await axios.get(`${API}/api/playlists/${id}/`)
        setPlaylist(res.data)
    }

    const handlePlaySong = (song, index) => {
        setCurrentIndex(index)
        playSong(song, playlist.songs)  //send song object to global player, playlist.songs to queue
    }

    if (!playlist) return <div style={{ background: '#252525', minHeight: '100vh' }} />

    return (
        <div style={{ minHeight: '100vh', background: '#252525', fontFamily: 'Georgia, serif' }}>
            <Navbar />
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

                <button onClick={() => navigate('/playlists')} 
                    className="btn-back"
                    style={{
                        background: 'none', 
                        border: 'none', 
                        color: '#E5DED2',
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 8, 
                        fontSize: 16, 
                        marginBottom: 32,
                    }}
                >
                    <RiArrowGoBackLine size={20} /> Back
                </button>

                <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
                    {/* ซ้าย */}
                    <div style={{ width: 280, flexShrink: 0, textAlign: 'center' }}>
                        {playlist.cover_image ? (
                            <img src={playlist.cover_image} 
                                style={{ width: 280, 
                                    height: 280, 
                                    objectFit: 'cover', 
                                    borderRadius: '50%', 
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                 }} 
                            />
                        ) : (
                            <div style={{ width: 280,
                                    height: 280, 
                                    borderRadius: '50%', 
                                    background: '#617891',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)' 
                                }}
                            >
                                <CgPlayButtonO size={64} color="#E5DED2" />
                            </div>
                        )}

                        <button onClick={togglePlay} 
                            className="btn-play" 
                            style={{
                                background: '#617891', 
                                border: 'none',
                                borderRadius: '50%', 
                                width: 52, 
                                height: 52, 
                                cursor: 'pointer',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '20px auto 0',
                            }}
                        >
                            {isPlaying ? <FiPause size={22} color="#E5DED2" /> : <FiPlay size={22} color="#E5DED2" />}
                        </button>

                        {currentSong && (
                            <p style={{ color: '#E5DED2', marginTop: 8, fontSize: 13 }}>
                                {currentIndex + 1}. {currentSong.title}
                            </p>
                        )}
                    </div>

                    {/* roght */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: '#E5DED2', fontSize: 48, marginBottom: 8, lineHeight: 1.1 }}>
                            {playlist.name}
                        </h1>

                        <button onClick={() => { setShowAddSongs(true); fetchAllSongs() }} 
                            className="btn-addsong"
                            style={{
                                background: '#617891', 
                                border: 'none', 
                                borderRadius: 8,
                                color: '#E5DED2', 
                                padding: '8px 16px', 
                                cursor: 'pointer',
                                fontSize: 14, 
                                marginBottom: 16,
                            }}
                        >
                            + Add Songs
                        </button>

                        <p style={{ color: '#617891', marginBottom: 32, fontSize: 14 }}>
                            {playlist.songs.length} songs
                        </p>

                        {playlist.songs.map((song, i) => (
                            <div key={song.id} 
                                onClick={() => handlePlaySong(song, i)}
                                className="btn-choose song-item"
                                style={{
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 16,
                                    padding: '12px 8px', 
                                    borderRadius: 8, 
                                    cursor: 'pointer',
                                    background: currentSong?.id === song.id ? 'rgba(97,120,145,0.3)' : '#353535',
                                    marginBottom: 4,
                                }}
                            >
                                <span style={{ color: '#617891', width: 24, textAlign: 'center', fontSize: 13 }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {song.cover_image ? (
                                    <img src={song.cover_image} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                                ) : (
                                    <div 
                                        style={{ width: 44, 
                                            height: 44, 
                                            borderRadius: 6, 
                                            background: '#617891',
                                            display: 'flex',
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}
                                    >
                                        <CgPlayButtonO size={24} color="#E5DED2" />
                                    </div>
                                )}
                                <span style={{ color: '#E5DED2', fontSize: 15 }}>{song.title}</span>
                                {currentSong?.id === song.id && isPlaying && (
                                    <span style={{ color: '#617891', marginLeft: 'auto', fontSize: 12 }}>▶ Playing...</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAddSongs && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: '#353535', borderRadius: 16, padding: 32, width: 400, maxHeight: '70vh', overflowY: 'auto' }}>
                        <h2 style={{ color: '#E5DED2', marginBottom: 16 }}>Add Songs</h2>
                        {allSongs.map(song => {
                            const inPlaylist = playlist.songs.some(s => s.id === song.id)
                            return (
                                <div key={song.id} 
                                    style={{ display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        padding: '10px 0', 
                                        borderBottom: '1px solid rgba(255,255,255,0.1)' 
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {song.cover_image ? (
                                            <img src={song.cover_image} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: 40, 
                                                    height: 40, 
                                                    borderRadius: 6, 
                                                    background: '#617891', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <CgPlayButtonO size={20} color="#E5DED2" />
                                            </div>
                                        )}
                                        <span style={{ color: '#E5DED2', fontSize: 14 }}>{song.title}</span>
                                    </div>
                                    <button onClick={() => inPlaylist ? handleRemoveSong(song.id) : handleAddSong(song.id)}
                                    className="btn-add_pl" 
                                    style={{
                                        background: inPlaylist ? '#c0392b' : '#617891',
                                        border: 'none', 
                                        borderRadius: 6,
                                        color: '#E5DED2', 
                                        padding: '6px 12px',
                                        cursor: 'pointer', 
                                        fontSize: 13,
                                    }}>
                                        {inPlaylist ? 'Remove' : 'Add'}
                                    </button>
                                </div>
                            )
                        })}
                        <button onClick={() => setShowAddSongs(false)} 
                            className="btn-done" 
                            style={{ marginTop: 16, 
                                width: '100%', 
                                padding: 10, 
                                background: 'transparent', 
                                border: '1px solid #617891', 
                                color: '#E5DED2', 
                                borderRadius: 8, 
                                cursor: 'pointer' 
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
