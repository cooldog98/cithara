import '../styles/GeneratePage.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { GrFormClose } from "react-icons/gr";
import { CgCheck } from "react-icons/cg";

const API = 'http://127.0.0.1:8000'

export default function GeneratePage() {
    const [form, setForm] = useState({
        title: '',
        prompt: '',
        mood: '',
        occasion: '',
        singer_gender: '',
    })
    const [taskId, setTaskId] = useState(localStorage.getItem('pendingTaskId') || null)
    const [status, setStatus] = useState(localStorage.getItem('pendingStatus') || null)
    const [audioUrl, setAudioUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleGenerate = async () => {
        setLoading(true)
        setStatus(null)
        setAudioUrl(null)
        if (!form.title.trim()) { alert('Please enter a song title'); setLoading(false); return }
        if (!form.prompt.trim()) { alert('Please enter a prompt'); setLoading(false); return }
        if (!form.mood) { alert('Please select a mood'); setLoading(false); return }
        if (!form.occasion) { alert('Please select an occasion'); setLoading(false); return }
        if (!form.singer_gender) { alert('Please select singer gender'); setLoading(false); return }
        const username = localStorage.getItem('username')
        const formData = new FormData()
        formData.append('username', username)
        formData.append('title', form.title)
        formData.append('prompt', form.prompt)
        formData.append('mood', form.mood)
        formData.append('occasion', form.occasion)
        formData.append('singer_gender', form.singer_gender)
        if (coverImage) formData.append('cover_image', coverImage)

        try {
            const res = await axios.post(`${API}/api/generate/`, formData)
            setTaskId(res.data.task_id)
            setStatus(res.data.status)
            setAudioUrl(res.data.audio_url)
            if (res.data.status === 'PENDING') pollStatus(res.data.task_id)
        } catch (err) {
            if (err.response?.status === 400) {
                alert('Song title "' + form.title + '" already exists. Please use a different title.')
            } else {
                console.error(err)
            }
        }
        setLoading(false)
    }

    const [progress, setProgress] = useState(0)

    const pollStatus = (id) => {
        localStorage.setItem('pendingTaskId', id)
        localStorage.setItem('pendingStatus', 'PENDING')
        
        let fakeProcess = 0
        const startTime = Date.now()
        const interval = setInterval(async () => {

            if (Date.now() - startTime > 2 * 60 * 1000) {
                setStatus('TIMEOUT')
                localStorage.removeItem('pendingTaskId')
                localStorage.removeItem('pendingStatus')
                clearInterval(interval)
                return
            }

            fakeProcess = Math.min(fakeProcess + Math.random() * 15, 90)
            setProgress(Math.round(fakeProcess))
    
            const res = await axios.get(`${API}/api/status/${id}/`)
            setStatus(res.data.status)
            localStorage.setItem('pendingStatus', res.data.status)
            
            if (res.data.status === 'SUCCESS') {
                setProgress(100)
                setAudioUrl(res.data.audio_url)
                localStorage.removeItem('pendingTaskId')
                localStorage.removeItem('pendingStatus')
                clearInterval(interval)
            }
        }, 5000)
    }

    const [coverImage, setCoverImage] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)

    useEffect(() => {
        const savedTaskId = localStorage.getItem('pendingTaskId')
        const savedStatus = localStorage.getItem('pendingStatus')
        if (savedTaskId && savedStatus && savedStatus !== 'SUCCESS') {
            setTaskId(savedTaskId)
            setStatus(savedStatus)
            pollStatus(savedTaskId)
        }
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API}/api/me/`, { withCredentials: true })
                if (res.data.authenticated) {
                    localStorage.setItem('username', res.data.username)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchUser()
    }, [])

    const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        setCoverImage(file)
        setCoverPreview(URL.createObjectURL(file))
    }
    }

    const [hovered_image, setHovered_image] = useState(false)
    const [pressed_image, setPressed_image] = useState(false)

    const [hovered_gen, setHovered_gen] = useState(false)
    const [pressed_gen, setPressed_gen] = useState(false)

    return (
        <div style={{ minHeight: '100vh', flexDirection: 'column', background: '#252525', fontFamily: 'Georgia, serif' }}>
            <Navbar />

            <div style={{ maxWidth: 640, margin: '20px auto', padding: '0 24px 48px 24px' }}>
            
                <h1 style={{ fontSize: '28px', color: '#3B2F2F', marginBottom: '4px', color: '#E5DED2' }}>
                    Generate Your Song
                </h1>
                <p style={{ color: '#8B6F6F', marginBottom: '32px', fontSize: '14px', color: '#E5DED2' }}>
                    Fill in the details below and let AI create your music
                </p>

                <div style={{ background: '#353535', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(75,57,53,0.1)' }}>

                <label style={{...labelStyle, color: '#E5DED2'}}>Cover Image (optional)</label>
                <div style={{ marginBottom: 24 }}>
                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="cover-upload"
                        onMouseEnter={() => setHovered_image(true)}
                        onMouseLeave={() => { setHovered_image(false); setPressed_image(false) }}
                        onMouseDown={() => setPressed_image(true)}
                        onMouseUp={() => setPressed_image(false)}
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            background: '#617891',
                            color: '#E5DED2',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transform: pressed_image ? 'scale(0.95)' : hovered_image ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            boxShadow: hovered_image ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                        }}>
                            Choose Image
                    </label>
                    <span style={{ color: '#E5DED2', marginLeft: 10, fontSize: '13px' }}>
                        {coverImage ? coverImage.name : 'No file chosen'}
                    </span>

                    {coverPreview && (
                        <img src={coverPreview} style={{ display: 'block', width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                    )}
                </div>
            
                    <label style={{...labelStyle, color: '#E5DED2'}}>Song Title</label>
                    <input
                        name="title"
                        placeholder="e.g. My Birthday Song"
                        value={form.title}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={{...labelStyle, color: '#E5DED2'}}>Lyrics Idea / Prompt</label>
                    <textarea 
                        name="prompt"
                        placeholder="Describe the song you want..."
                        value={form.prompt}
                        onChange={handleChange}
                        rows={4}
                        style={inputStyle}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
                        <div>
                            <label style={{...labelStyle, color: '#E5DED2'}}>Mood</label>
                            <select name="mood" value={form.mood} onChange={handleChange} style={inputStyle}>
                                <option value="">-- Mood --</option>
                                {['happy','sad','romantic','excited','calm','nostalgic','inspirational'].map(m => (
                                <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{...labelStyle, color: '#E5DED2'}}>Occasion</label>
                            <select name="occasion" value={form.occasion} onChange={handleChange} style={inputStyle}>
                                <option value="">-- Occasion --</option>
                                {['birthday','wedding','anniversary','graduation','christmas','party','farewell'].map(o => (
                                <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{...labelStyle, color: '#E5DED2'}}>Singer</label>
                            <select name="singer_gender" value={form.singer_gender} onChange={handleChange} style={inputStyle}>
                                <option value="">-- Gender --</option>
                                {['male','female','both'].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        onMouseEnter={() => setHovered_gen(true)}
                        onMouseLeave={() => { setHovered_gen(false); setPressed_gen(false) }}
                        onMouseDown={() => setPressed_gen(true)}
                        onMouseUp={() => setPressed_gen(false)}
                        style={{...buttonStyle, color: '#E5DED2',
                            transform: pressed_gen ? 'scale(0.95)' : hovered_gen ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            boxShadow: hovered_gen ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                        }}
                    >
                        {loading ? 'Generating...' : 'Generate Song'}
                    </button>
                </div>

                {status && (
                    <div style={{ maxWidth: 640, marginTop: 24, background: '#617891', borderRadius: '16px', padding: '24px 24px 28px 24px' }}>
                        <p style={{color: '#E5DED2', fontSize: '13px', marginBottom: 8}}>Task ID: {taskId}</p>
                        <p style={{ fontWeight: 'bold', color: '#E5DED2', marginBottom: 20 }}>
                            Status: {
                                status === 'TIMEOUT'
                                ?  <span><GrFormClose size={20} /> Generation failed</span>
                                : status === 'PENDING' || status === 'TEXT_SUCCESS'
                                ? <span>
                                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                                    {' '}Generating... please wait
                                </span>
                                : <span><CgCheck size={20} /> Done!</span>
                            }
                        </p>

                        {/* tell reason timeout */}
                        {status === 'TIMEOUT' && (
                            <p style={{ color: '#E5DED2', fontSize: '13px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: 20}}>
                                The song took too long to generate (over 2 minutes). This may be due to high server load or an issue with the AI service. Please try again.
                            </p>
                        )}

                        {/* Progress bar */}
                        {status !== 'SUCCESS' && (
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ color: '#E5DED2', fontSize: '12px' }}>Generating...</span>
                                    <span style={{ color: '#E5DED2', fontSize: '12px' }}>{progress}%</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 8 }}>
                                    <div style={{
                                        height: 8,
                                        borderRadius: 99,
                                        background: '#E5DED2',
                                        width: `${progress}%`,
                                        transition: 'width 0.5s ease',
                                    }} />
                                </div>
                            </div>
                        )}

                        {audioUrl && (
                            <div>
                                <p style={{ color: '#E5DED2', marginBottom: 8 }}>Your Song:</p>
                                <audio controls src={audioUrl} style={{ width: '100%' }} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
// #617891
// #E5DED2
// #252525
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#4B3935',
  marginBottom: '6px',
}

const inputStyle = {
  padding: '10px 12px',
  fontSize: '15px',
  borderRadius: '8px',
  border: '1px solid #D9C8B8',
  width: '100%',
  background: '#FFFDF9',
  color: '#3B2F2F',
  marginBottom: '16px',
  boxSizing: 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '14px',
  fontSize: '16px',
  background: '#617891',
  color: '#E5DED2',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontFamily: 'Georgia, serif',
  letterSpacing: '0.5px',
}
// E5DED2