import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:8000'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [username, setUsername] = useState(localStorage.getItem('username') || '')

    useEffect(() => {
        const stored = localStorage.getItem('username')
        if (stored) {
            setUsername(stored)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await axios.post(`${API}/api/logout/`)
        } catch (err) {}
        localStorage.removeItem('username')
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    const [hovered_gen, setHovered_gen] = useState(false)
    const [pressed_gen, setPressed_gen] = useState(false)
    const [hovered_lib, setHovered_lib] = useState(false)
    const [pressed_lib, setPressed_lib] = useState(false)
    const [hovered_playlist, setHovered_playlist] = useState(false)
    const [pressed_playlist, setPressed_playlist] = useState(false)
    const [hovered_out, setHovered_out] = useState(false)
    const [pressed_out, setPressed_out] = useState(false)

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 32px',
            background: '#617891',
            color: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <span style={{ fontWeight: 'bold', fontSize: '30px', color: 'white' }}>Cithara</span>
            <div style={{ display: 'flex', fontSize: '30px', gap: 16, alignItems: 'center', color: '#E5DED2' }}>
                <button onClick={() => navigate('/generate')}
                    onMouseEnter={() => setHovered_gen(true)}
                    onMouseLeave={() => { setHovered_gen(false); setPressed_gen(false) }}
                    onMouseDown={() => setPressed_gen(true)}
                    onMouseUp={() => setPressed_gen(false)}
                    style={{...navBtn,
                        background: isActive('/generate') ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                        transform: pressed_gen ? 'scale(0.95)' : hovered_gen ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered_gen ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}>
                    Generate
                </button>

                <button onClick={() => navigate('/library')}
                    onMouseEnter={() => setHovered_lib(true)}
                    onMouseLeave={() => { setHovered_lib(false); setPressed_lib(false) }}
                    onMouseDown={() => setPressed_lib(true)}
                    onMouseUp={() => setPressed_lib(false)}
                    style={{...navBtn,
                        background: isActive('/library') ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                        transform: pressed_lib ? 'scale(0.95)' : hovered_lib ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered_lib ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}>
                    Library
                </button>

                <button onClick={() => navigate('/playlists')}
                    onMouseEnter={() => setHovered_playlist(true)}
                    onMouseLeave={() => { setHovered_playlist(false); setPressed_playlist(false) }}
                    onMouseDown={() => setPressed_playlist(true)}
                    onMouseUp={() => setPressed_playlist(false)}
                    style={{...navBtn,
                        background: isActive('/playlists') ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                        transform: pressed_playlist ? 'scale(0.95)' : hovered_playlist ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered_playlist ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}>
                    Playlists
                </button>

                <span style={{ fontSize: '16px' }}>{username}</span>

                <button onClick={handleLogout}
                    onMouseEnter={() => setHovered_out(true)}
                    onMouseLeave={() => { setHovered_out(false); setPressed_out(false) }}
                    onMouseDown={() => setPressed_out(true)}
                    onMouseUp={() => setPressed_out(false)}
                    style={{...navBtn,
                        background: '#ff4d4d',
                        transform: pressed_out ? 'scale(0.95)' : hovered_out ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered_out ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}>
                    Logout
                </button>
            </div>
        </div>
    )
}

const navBtn = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
}