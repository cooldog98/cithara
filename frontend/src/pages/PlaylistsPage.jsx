import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { FiPlus } from 'react-icons/fi'
import { CgPlayButtonO } from "react-icons/cg";
import '../styles/PlaylistsPage.css'


const API = 'http://127.0.0.1:8000'

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')
    const [coverImage, setCoverImage] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const navigate = useNavigate()

    useEffect(() => { fetchPlaylists() }, [])

    const fetchPlaylists = async () => {
        const username = localStorage.getItem('username')
        const res = await axios.get(`${API}/api/playlists/?username=${username}`)
        setPlaylists(res.data.playlists)
    }

    const handleCreate = async () => {
        const username = localStorage.getItem('username')
        const formData = new FormData()
        formData.append('name', name)
        formData.append('username', username)
        if (coverImage) formData.append('cover_image', coverImage)
        await axios.post(`${API}/api/playlists/`, formData)
        setShowModal(false)
        setName('')
        setCoverImage(null)
        setCoverPreview(null)
        fetchPlaylists()
    }

    const [hovered_add, setHovered_add] = useState(false)
    const [pressed_add, setPressed_add] = useState(false)

    const [hovered_image, setHovered_image] = useState(false)
    const [pressed_image, setPressed_image] = useState(false)

    const [hovered_cancen, setHovered_cancen] = useState(false)
    const [pressed_cancen, setPressed_cancen] = useState(false)

    const [hovered_create, setHovered_create] = useState(false)
    const [pressed_create, setPressed_create] = useState(false)

    return (
        <div style={{ minHeight: '100vh', background: '#252525', fontFamily: 'Georgia, serif' }}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <h1 style={{ color: '#E5DED2', fontSize: 32 }}>
                        My Playlists
                    </h1>

                    <button onClick={() => setShowModal(true)} 
                        onMouseEnter={() => setHovered_add(true)}
                        onMouseLeave={() => { setHovered_add(false); setPressed_add(false) }}
                        onMouseDown={() => setPressed_add(true)}
                        onMouseUp={() => setPressed_add(false)}
                        style={{
                            background: '#617891', 
                            border: 'none', 
                            borderRadius: '50%',
                            width: 44, 
                            height: 44, 
                            cursor: 'pointer',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transform: pressed_add ? 'scale(0.95)' : hovered_add ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            boxShadow: hovered_add ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',

                        }}
                    >
                        <FiPlus size={24} color="#E5DED2" />
                    </button>
                </div>

                {/* Grid playlist */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {playlists.map(p => (
                        <div key={p.id} 
                            onClick={() => navigate(`/playlists/${p.id}`)}
                            style={{ cursor: 'pointer', 
                            textAlign: 'center' 
                            }}
                        >
                            {p.cover_image ? (
                                <img src={p.cover_image} 
                                    className="btn-playlist"
                                    style={{ width: '100%', 
                                        aspectRatio: '1', 
                                        objectFit: 'cover', 
                                        borderRadius: 16 
                                    }} 
                                />
                            ) : (
                                <div 
                                    className="btn-playlist"
                                    style={{ width: '100%', 
                                        aspectRatio: '1', 
                                        background: '#617891', 
                                        borderRadius: 16, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: 40 
                                    }}
                                >
                                    <CgPlayButtonO size={64} color="#E5DED2" />
                                </div>
                            )}
                            <p style={{ color: '#E5DED2', marginTop: 8, fontSize: 14 }}>{p.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal create playlist */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: '#353535', borderRadius: 16, padding: 32, width: 360 }}>
                        <h2 style={{ color: '#E5DED2', marginBottom: 20 }}>New Playlist</h2>

                        <input
                            placeholder="Playlist name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: '100%', 
                                padding: '10px 12px', 
                                borderRadius: 8, 
                                border: '1px solid #617891', 
                                background: '#252525', 
                                color: '#E5DED2', 
                                fontSize: 15, 
                                marginBottom: 16, 
                                boxSizing: 'border-box' 
                            }}
                        />

                        <input id="playlist-cover" type="file" accept="image/*" onChange={e => {
                            const f = e.target.files[0]
                            if (f) { setCoverImage(f); setCoverPreview(URL.createObjectURL(f)) }
                        }} style={{ display: 'none' }} />

                        <label htmlFor="playlist-cover" 
                            onMouseEnter={() => setHovered_image(true)}
                            onMouseLeave={() => { setHovered_image(false); setPressed_image(false) }}
                            onMouseDown={() => setPressed_image(true)}
                            onMouseUp={() => setPressed_image(false)}
                            style={{ display: 'block', 
                                padding: '10px', 
                                background: '#617891', 
                                color: '#E5DED2', 
                                borderRadius: 8, 
                                cursor: 'pointer', 
                                textAlign: 'center', 
                                marginBottom: 12,
                                transform: pressed_image ? 'scale(0.95)' : hovered_image ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: hovered_image ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                            }}
                        >
                            Choose Cover Image
                        </label>

                        {coverPreview && <img src={coverPreview} 
                            style={{ width: '100%', 
                                aspectRatio: '1', 
                                objectFit: 'cover', 
                                borderRadius: 12, 
                                marginBottom: 16 
                            }} 
                        />}

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setShowModal(false)}
                                onMouseEnter={() => setHovered_cancen(true)}
                                onMouseLeave={() => { setHovered_cancen(false); setPressed_cancen(false) }}
                                onMouseDown={() => setPressed_cancen(true)}
                                onMouseUp={() => setPressed_cancen(false)}
                                style={{ flex: 1, 
                                    padding: 10, 
                                    background: 'transparent', 
                                    border: '1px solid #617891', 
                                    color: '#E5DED2', 
                                    borderRadius: 8, 
                                    cursor: 'pointer',
                                    transform: pressed_cancen ? 'scale(0.95)' : hovered_cancen ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    boxShadow: hovered_cancen ? '0 8px 20px rgba(0,0,0,0.3)' : 'none', 
                                }}
                            >
                                Cancel
                            </button>

                            <button onClick={handleCreate}
                                onMouseEnter={() => setHovered_create(true)}
                                onMouseLeave={() => { setHovered_create(false); setPressed_create(false) }}
                                onMouseDown={() => setPressed_create(true)}
                                onMouseUp={() => setPressed_create(false)}
                                style={{ flex: 1, 
                                    padding: 10, 
                                    background: '#617891', 
                                    border: 'none', 
                                    color: '#E5DED2', 
                                    borderRadius: 8, 
                                    cursor: 'pointer',
                                    transform: pressed_create ? 'scale(0.95)' : hovered_create ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    boxShadow: hovered_create ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}