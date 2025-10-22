import React, { useState, useEffect, useRef } from 'react';

interface Participant {
    id: string;
    name: string;
    avatar: string;
    color: string;
    isMuted: boolean;
    isVideoOff: boolean;
}

interface AnonymousGroupChatProps {
    onLeave: () => void;
}

// Generate random anonymous names
const ANONYMOUS_NAMES = [
    'Cosmic Wolf', 'Neon Tiger', 'Electric Phoenix', 'Cyber Dragon', 
    'Quantum Fox', 'Digital Hawk', 'Plasma Bear', 'Laser Owl',
    'Virtual Lion', 'Binary Eagle', 'Pixel Panther', 'Matrix Leopard',
    'Chrome Falcon', 'Silicon Shark', 'Techno Raven', 'Hologram Puma'
];

const AVATAR_COLORS = [
    'from-pink-500 to-rose-600',
    'from-purple-500 to-indigo-600',
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600',
    'from-indigo-500 to-purple-600',
    'from-teal-500 to-green-600',
];

const generateParticipant = (id: string): Participant => {
    const name = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const emoji = ['🦊', '🐺', '🦅', '🐉', '🦁', '🐯', '🦉', '🐆'][Math.floor(Math.random() * 8)];
    
    return {
        id,
        name,
        avatar: emoji,
        color,
        isMuted: Math.random() > 0.7,
        isVideoOff: Math.random() > 0.8,
    };
};

const AnonymousGroupChat: React.FC<AnonymousGroupChatProps> = ({ onLeave }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [myId] = useState(() => `user-${Date.now()}`);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [groupMessage, setGroupMessage] = useState('');
    const [showControls, setShowControls] = useState(true);
    const [connectionTime, setConnectionTime] = useState(0);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Initialize with 3-7 random participants including yourself
    useEffect(() => {
        const initialCount = 3 + Math.floor(Math.random() * 5);
        const initialParticipants: Participant[] = [];
        
        // Add yourself
        initialParticipants.push(generateParticipant(myId));
        
        // Add other random participants
        for (let i = 1; i < initialCount; i++) {
            initialParticipants.push(generateParticipant(`user-${Date.now()}-${i}`));
        }
        
        setParticipants(initialParticipants);

        // Simulate users joining/leaving randomly
        const joinLeaveInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setParticipants(prev => {
                    if (Math.random() > 0.5 && prev.length < 12) {
                        // Someone joins
                        const newParticipant = generateParticipant(`user-${Date.now()}-${Math.random()}`);
                        setGroupMessage(`${newParticipant.name} joined the group`);
                        setTimeout(() => setGroupMessage(''), 3000);
                        return [...prev, newParticipant];
                    } else if (prev.length > 2) {
                        // Someone leaves (but not you)
                        const leavingIndex = Math.floor(Math.random() * (prev.length - 1)) + 1;
                        const leavingUser = prev[leavingIndex];
                        setGroupMessage(`${leavingUser.name} left the group`);
                        setTimeout(() => setGroupMessage(''), 3000);
                        return prev.filter((_, i) => i !== leavingIndex);
                    }
                    return prev;
                });
            }
        }, 8000);

        return () => clearInterval(joinLeaveInterval);
    }, [myId]);

    // Connection timer
    useEffect(() => {
        const interval = setInterval(() => {
            setConnectionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto-hide controls
    useEffect(() => {
        const resetHideTimer = () => {
            setShowControls(true);
            if (hideControlsTimeoutRef.current) {
                clearTimeout(hideControlsTimeoutRef.current);
            }
            hideControlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        };

        window.addEventListener('mousemove', resetHideTimer);
        window.addEventListener('touchstart', resetHideTimer);
        resetHideTimer();

        return () => {
            window.removeEventListener('mousemove', resetHideTimer);
            window.removeEventListener('touchstart', resetHideTimer);
            if (hideControlsTimeoutRef.current) {
                clearTimeout(hideControlsTimeoutRef.current);
            }
        };
    }, []);

    // Access camera
    useEffect(() => {
        let stream: MediaStream;
        const startStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
            }
        };

        startStream();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleToggleMute = () => {
        setIsMuted(!isMuted);
        setParticipants(prev => 
            prev.map(p => p.id === myId ? { ...p, isMuted: !isMuted } : p)
        );
    };

    const handleToggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        setParticipants(prev => 
            prev.map(p => p.id === myId ? { ...p, isVideoOff: !isVideoOff } : p)
        );
    };

    const myParticipant = participants.find(p => p.id === myId);
    const otherParticipants = participants.filter(p => p.id !== myId);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/40"></div>

            {/* Header */}
            <div className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
                <div className="bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
                                🌍
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Anonymous Group Chat</h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 font-mono">{participants.length} people online</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-cyan-300 font-mono">{formatDuration(connectionTime)}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onLeave}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors font-semibold text-sm"
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            </div>

            {/* Group message notification */}
            {groupMessage && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
                    <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium border border-purple-500/50">
                        {groupMessage}
                    </div>
                </div>
            )}

            {/* Video Grid */}
            <div className="flex-1 p-4 relative z-10 overflow-y-auto">
                <div className={`grid gap-4 h-full ${
                    participants.length === 1 ? 'grid-cols-1' :
                    participants.length === 2 ? 'grid-cols-2' :
                    participants.length <= 4 ? 'grid-cols-2 grid-rows-2' :
                    participants.length <= 6 ? 'grid-cols-3 grid-rows-2' :
                    participants.length <= 9 ? 'grid-cols-3 grid-rows-3' :
                    'grid-cols-4 grid-rows-3'
                }`}>
                    {participants.map((participant, index) => (
                        <div 
                            key={participant.id}
                            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
                        >
                            {/* Video or placeholder */}
                            {participant.id === myId && !isVideoOff ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : participant.isVideoOff ? (
                                <div className={`w-full h-full bg-gradient-to-br ${participant.color} flex items-center justify-center`}>
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">{participant.avatar}</div>
                                        <p className="text-sm text-white/80">Camera Off</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                                    <video
                                        src="https://assets.mixkit.co/videos/preview/mixkit-spinning-around-the-earth-29351-large.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
                            )}

                            {/* Participant info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${participant.color} flex items-center justify-center text-sm`}>
                                            {participant.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {participant.name}
                                                {participant.id === myId && <span className="text-cyan-400 ml-1">(You)</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {participant.isMuted && (
                                        <div className="bg-red-600 p-1.5 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 5.586A2 2 0 015 7v6a7 7 0 0012.36 4.879m1.154-4.879a3 3 0 00-3-3V5a3 3 0 10-6 0v6m12 0a9 9 0 11-18 0m3-3l12 12" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Speaking indicator */}
                            {!participant.isMuted && Math.random() > 0.5 && (
                                <div className="absolute top-2 left-2 bg-green-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    Speaking
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Control Bar */}
            <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-md p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-6">
                            {/* Microphone */}
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={handleToggleMute}
                                    className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
                                        isMuted 
                                            ? 'bg-red-600 hover:bg-red-500' 
                                            : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                                    }`}
                                    title={isMuted ? "Unmute" : "Mute"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        {isMuted ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 5.586A2 2 0 015 7v6a7 7 0 0012.36 4.879m1.154-4.879a3 3 0 00-3-3V5a3 3 0 10-6 0v6m12 0a9 9 0 11-18 0m3-3l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        )}
                                    </svg>
                                </button>
                                <span className="text-xs text-gray-400 font-medium">{isMuted ? 'Muted' : 'Mic'}</span>
                            </div>

                            {/* Video */}
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={handleToggleVideo}
                                    className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
                                        isVideoOff 
                                            ? 'bg-red-600 hover:bg-red-500' 
                                            : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                                    }`}
                                    title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        {isVideoOff ? (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" strokeWidth={2.5} />
                                            </>
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        )}
                                    </svg>
                                </button>
                                <span className="text-xs text-gray-400 font-medium">{isVideoOff ? 'Off' : 'Video'}</span>
                            </div>

                            {/* Leave */}
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={onLeave}
                                    className="p-5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full transition-all duration-200 shadow-xl hover:shadow-red-500/50 hover:scale-110"
                                    title="Leave Group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.5 13.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5v-3c0-.28-.22-.5-.5-.5h-10c-.28 0-.5.22-.5.5v3a2.5 2.5 0 01-2.5 2.5c-1.38 0-2.5-1.12-2.5-2.5V9c0-1.1.45-2.1 1.17-2.83A3.96 3.96 0 015.5 5h13c1.1 0 2.1.45 2.83 1.17.72.73 1.17 1.73 1.17 2.83v4.5z" transform="rotate(135 12 12)"/>
                                    </svg>
                                </button>
                                <span className="text-xs text-red-400 font-medium">Leave</span>
                            </div>
                        </div>

                        {/* Participant count */}
                        <div className="mt-4 text-center text-xs text-gray-400 font-mono">
                            {participants.length} participant{participants.length !== 1 ? 's' : ''} in the room
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls hint */}
            {!showControls && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-gray-300">
                        Move mouse to show controls
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnonymousGroupChat;

