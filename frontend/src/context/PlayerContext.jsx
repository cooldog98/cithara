import { createContext, useContext, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [queue, setQueue] = useState([])
    const [queueIndex, setQueueIndex] = useState(0)
    const audioRef = useRef(null)

    const playSong = (song, playlist = []) => {
        if (!song?.audio_url) return
        setCurrentSong(song)
        setQueue(playlist)
        setQueueIndex(playlist.findIndex(s => s.id === song.id))
        setIsPlaying(true)
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.src = song.audio_url
                audioRef.current.play()
            }
        }, 100)
    }

    const playNext = () => {
        if (queue.length === 0) return
        const nextIndex = queueIndex + 1
        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex]
            setCurrentSong(nextSong)
            setQueueIndex(nextIndex)
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.src = nextSong.audio_url
                    audioRef.current.play()
                }
            }, 100)
        } else {
            setIsPlaying(false)  // เพลงสุดท้ายแล้ว หยุด
        }
    }

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay, audioRef }}>
            {children}
            <audio ref={audioRef} onEnded={playNext} />
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)