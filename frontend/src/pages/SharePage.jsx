import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://127.0.0.1:8000'

export default function SharePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [song, setSong] = useState(null)

    useEffect(() => {
        const username = localStorage.getItem('username')
        if (!username) {
            localStorage.setItem('redirectAfterLogin', `/share/${id}`)
            navigate('/')
            return
        }
        axios.get(`${API}/api/songs/${id}/`)
            .then(res => setSong(res.data))
            .catch(() => navigate('/'))
    }, [id])

    if (!song) return <div style={{ background: '#252525', minHeight: '100vh' }} />

    return (
        <div style={{ minHeight: '100vh', background: '#252525', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#353535', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center' }}>
                {song.cover_image ? (
                    <img src={song.cover_image} style={{ width: 200, height: 200, borderRadius: 16, objectFit: 'cover', marginBottom: 20 }} />
                ) : (
                    <div style={{ width: 200, height: 200, borderRadius: 16, background: '#617891', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, margin: '0 auto 20px' }}>🎵</div>
                )}

                <h1 style={{ color: '#E5DED2', fontSize: 28, marginBottom: 8 }}>{song.title}</h1>
                <p style={{ color: '#617891', fontSize: 14, marginBottom: 24 }}>Shared song</p>

                <audio controls src={song.audio_url} style={{ width: '100%', marginBottom: 24 }} />

                <button onClick={() => navigate('/')} style={{
                    background: '#617891', border: 'none', borderRadius: 10,
                    color: '#E5DED2', padding: '12px 24px', cursor: 'pointer',
                    fontSize: 15, width: '100%',
                }}>
                    Try Cithara — Create your own song
                </button>
            </div>
        </div>
    )
}