import '../styles/DashbordPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FcGoogle } from 'react-icons/fc'

const API = 'http://127.0.0.1:8000'

export default function DashbordPage() {
    const navigate = useNavigate()
    const [isRegister, setIsRegister] = useState(false)
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = async () => {
        try {
            const endpoint = isRegister ? '/api/register/' : '/api/login/'
            const res = await axios.post(`${API}${endpoint}`, form)
            if (res.data.success) {
                localStorage.setItem('username', res.data.username)
                
                const redirect = localStorage.getItem('redirectAfterLogin')
                if (redirect) {
                    localStorage.removeItem('redirectAfterLogin')
                    navigate(redirect)
                } else {
                    navigate('/generate')
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong')
        }
    }

    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const [hovered_reg, setHovered_reg] = useState(false)
    const [pressed_reg, setPressed_reg] = useState(false)

    const [hovered_goo, setHovered_goo] = useState(false)
    const [pressed_goo, setPressed_goo] = useState(false)
    
// #617891
// #E5DED2
// #252525

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#252525',
        }}>
            <h1 style={{ marginBottom: '8px', color: '#E5DED2' }}>Cithara</h1>
            <p style={{ marginBottom: '4px', color: '#E5DED2' }}>Your personal AI music generator</p>
            <p style={{ marginBottom: '32px', color: '#888', fontSize: '14px', textAlign: 'center', maxWidth: 400 }}>
                Create unique songs tailored to your mood, occasion, and style.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
                {/* <h2 style={{ textAlign: 'center' }}>{isRegister ? 'Register' : 'Login'}</h2> */}

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    style={inputStyle}
                />

                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                <button
                    onClick={handleSubmit}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => { setHovered(false); setPressed(false) }}
                    onMouseDown={() => setPressed(true)}
                    onMouseUp={() => setPressed(false)}
                    style={{
                        padding: '12px',
                        fontSize: '16px',
                        background: '#617891',
                        color: '#E5DED2',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#E5DED2' }}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <span
                        onClick={() => { setIsRegister(!isRegister); setError(null) }}
                        onMouseEnter={() => setHovered_reg(true)}
                        onMouseLeave={() => { setHovered_reg(false); setPressed_reg(false) }}
                        onMouseDown={() => setPressed_reg(true)}
                        onMouseUp={() => setPressed_reg(false)}
                        style={{ color: '#617891', cursor: 'pointer',
                            marginLeft: 6,
                            display: 'inline-block',
                            transform: pressed_reg ? 'scale(0.95)' : hovered_reg ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.15s',
                        }}
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </span>
                </p>

                <a href="http://127.0.0.1:8000/accounts/google/login/?process=login"
                    onMouseEnter={() => setHovered_goo(true)}
                    onMouseLeave={() => { setHovered_goo(false); setPressed_goo(false) }}
                    onMouseDown={() => setPressed_goo(true)}
                    onMouseUp={() => setPressed_goo(false)} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px',
                        background: '#617891',
                        color: '#E5DED2',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontSize: '16px',
                        transform: pressed_goo ? 'scale(0.95)' : hovered_goo ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: hovered_goo ? '0 8px 20px rgba(0,0,0,0.3)' : 'none',
                    }}
                >
                    <FcGoogle size={20} />
                    Login with Google
                </a>
            </div>
        </div>
    )
}

const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
}
