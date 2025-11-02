import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';

interface RandomAnonymousWebcamProps {
    currentUser: UserProfile;
    onLeave: () => void;
}

const ANONYMOUS_NAMES = [
    'Cosmic Wolf', 'Neon Tiger', 'Electric Phoenix', 'Cyber Dragon', 
    'Quantum Fox', 'Digital Hawk', 'Plasma Bear', 'Laser Owl',
    'Virtual Lion', 'Binary Eagle', 'Pixel Panther', 'Matrix Leopard',
    'Chrome Falcon', 'Silicon Shark', 'Techno Raven', 'Hologram Puma',
    'Neon Jaguar', 'Phantom Cobra', 'Shadow Fox', 'Crystal Hawk'
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

// Simulated video feeds for other participants
const SIMULATED_VIDEOS = [
    'https://assets.mixkit.co/videos/preview/mixkit-woman-looking-at-her-cell-phone-while-sitting-in-a-4540-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-young-man-looking-at-his-cell-phone-4823-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-a-cafe-4620-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-smiling-at-camera-1291-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-in-an-office-working-on-a-laptop-4635-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-using-a-smartphone-4826-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-working-from-home-on-his-laptop-4248-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-while-using-her-smartphone-4827-large.mp4',
];

interface AnonymousParticipant {
    id: string;
    name: string;
    avatar: string;
    color: string;
    isMuted: boolean;
    isVideoOff: boolean;
    videoUrl: string;
}

const generateParticipant = (): AnonymousParticipant => {
    const name = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const emoji = ['🦊', '🐺', '🦅', '🐉', '🦁', '🐯', '🦉', '🐆'][Math.floor(Math.random() * 8)];
    const videoUrl = SIMULATED_VIDEOS[Math.floor(Math.random() * SIMULATED_VIDEOS.length)];
    
    return {
        id: `anon-${Date.now()}-${Math.random()}`,
        name,
        avatar: emoji,
        color,
        isMuted: Math.random() > 0.7,
        isVideoOff: false,
        videoUrl,
    };
};

const RandomAnonymousWebcam: React.FC<RandomAnonymousWebcamProps> = ({ currentUser, onLeave }) => {
    const [partner, setPartner] = useState<AnonymousParticipant | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [connectionTime, setConnectionTime] = useState(0);
    const [isConnecting, setIsConnecting] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [ratePartner, setRatePartner] = useState<boolean | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Connect to random partner
    useEffect(() => {
        const connectDelay = setTimeout(() => {
            const randomPartner = generateParticipant();
            setPartner(randomPartner);
            setIsConnecting(false);
        }, 2000 + Math.random() * 3000);

        return () => clearTimeout(connectDelay);
    }, []);

    // Connection timer
    useEffect(() => {
        if (!isConnecting && partner) {
            const interval = setInterval(() => {
                setConnectionTime(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isConnecting, partner]);

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
                setLocalStream(stream);
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
        if (localStream) {
            const newMuteState = !isMuted;
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !newMuteState;
            });
            setIsMuted(newMuteState);
        }
    };

    const handleToggleVideo = () => {
        if (localStream) {
            const newVideoState = !isVideoOff;
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !newVideoState;
            });
            setIsVideoOff(newVideoState);
        }
    };

    const handleHangUp = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        onLeave();
    };

    const handleRating = (liked: boolean) => {
        setRatePartner(liked);
        setTimeout(() => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            onLeave();
        }, 1000);
    };

    if (ratePartner !== null) {
        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
                <div className="relative z-10 text-center animate-fade-in">
                    <div className="text-6xl mb-4">{ratePartner ? '💚' : '💔'}</div>
                    <h2 className="text-2xl font-bold mb-2">{ratePartner ? 'Match!' : 'Passed'}</h2>
                    <p className="text-gray-400">Looking for someone new...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            
            {/* Main Video Area */}
            <div className="absolute inset-0" style={{ paddingTop: showControls ? '80px' : '0' }}>
                {/* Partner Video */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    {isConnecting ? (
                        <div className="text-center animate-fade-in">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold mb-2">Finding someone...</h3>
                            <p className="text-gray-400">Connecting you to a random stranger</p>
                        </div>
                    ) : partner ? (
                        <>
                            {partner.isVideoOff ? (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className={`text-8xl mb-4 bg-gradient-to-r ${partner.color} bg-clip-text text-transparent`}>
                                            {partner.avatar}
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">{partner.name}</h3>
                                        <p className="text-gray-400 text-sm">Video is off</p>
                                    </div>
                                </div>
                            ) : (
                                <video
                                    key={partner.videoUrl}
                                    src={partner.videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            )}
                            {/* Partner Name Overlay */}
                            <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 flex items-center">
                                <span className="text-2xl mr-2">{partner.avatar}</span>
                                <div>
                                    <h3 className="font-bold text-lg">{partner.name}</h3>
                                    {partner.isMuted && <p className="text-xs text-gray-400">🔇 Muted</p>}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Your Video (Small Square Overlay) */}
            <div className="absolute bottom-24 right-4 z-20 group">
                {isVideoOff ? (
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl border-2 border-purple-400/50 shadow-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-1">👤</div>
                        </div>
                    </div>
                ) : (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-32 h-32 object-cover rounded-xl border-2 border-purple-400/50 shadow-2xl transition-all group-hover:border-purple-400 group-hover:shadow-purple-500/50"
                    />
                )}
            </div>

            {/* Controls */}
            <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Top Info Bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2">
                                <p className="text-sm text-gray-400">Connection time</p>
                                <p className="text-lg font-bold text-pink-400">{formatDuration(connectionTime)}</p>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2">
                                <p className="text-sm text-gray-400">Mode</p>
                                <p className="text-lg font-bold text-cyan-400">Random 1-on-1</p>
                            </div>
                        </div>
                        <button
                            onClick={handleHangUp}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                        >
                            End Call
                        </button>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-center space-x-6">
                        {/* Mute Button */}
                        <button
                            onClick={handleToggleMute}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMuted ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                )}
                            </svg>
                        </button>

                        {/* Video Toggle */}
                        <button
                            onClick={handleToggleVideo}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isVideoOff ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                )}
                            </svg>
                        </button>

                        {/* Like/Dislike Buttons */}
                        {partner && (
                            <>
                                <button
                                    onClick={() => handleRating(false)}
                                    className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleRating(true)}
                                    className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomAnonymousWebcam;

