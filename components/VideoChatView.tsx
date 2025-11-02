import React, { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../types';

interface VideoChatViewProps {
    userProfile: UserProfile;
    matchedProfile: UserProfile;
    onEndCall: () => void;
}

// Icon Components
const MicOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const MicOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 5.586A2 2 0 015 7v6a7 7 0 0012.36 4.879m1.154-4.879a3 3 0 00-3-3V5a3 3 0 10-6 0v6m12 0a9 9 0 11-18 0m3-3l12 12" />
    </svg>
);

const VideoOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const VideoOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" strokeWidth={2.5} />
    </svg>
);

const EndCallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.5 13.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5v-3c0-.28-.22-.5-.5-.5h-10c-.28 0-.5.22-.5.5v3a2.5 2.5 0 01-2.5 2.5c-1.38 0-2.5-1.12-2.5-2.5V9c0-1.1.45-2.1 1.17-2.83A3.96 3.96 0 015.5 5h13c1.1 0 2.1.45 2.83 1.17.72.73 1.17 1.73 1.17 2.83v4.5z" transform="rotate(135 12 12)"/>
    </svg>
);

const SwitchCameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const FullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
);

const VideoChatView: React.FC<VideoChatViewProps> = ({ matchedProfile, onEndCall }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [callDuration, setCallDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Call duration timer
    useEffect(() => {
        const interval = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format call duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto-hide controls after 3 seconds of inactivity
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
                setError("Camera/Microphone access denied. Please check your browser permissions.");
            }
        };

        startStream();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleToggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const handleToggleVideo = () => {
        if (localStream) {
            const newVideoState = !isVideoOff;
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !newVideoState;
            });
            setIsVideoOff(newVideoState);
            
            // Force video element to update
            if (localVideoRef.current && !newVideoState) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.play().catch(err => console.log('Play error:', err));
            }
        }
    };

    const handleSwitchCamera = async () => {
        // This would require enumerating devices and switching - simplified for demo
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 1) {
                // In a real implementation, you'd cycle through cameras
                alert('Camera switching would cycle through available cameras');
            }
        } catch (err) {
            console.error('Error switching camera:', err);
        }
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement && containerRef.current) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    
    const handleEndCall = () => {
        localStream?.getTracks().forEach(track => track.stop());
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        onEndCall();
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
            {/* Remote Video (Simulated) */}
            <video
                src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-woman-in-a-dark-room-41311-large.mp4"
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay for better UI visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80"></div>

            {/* Header - with fade in/out based on showControls */}
            <div className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
                <div className="bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm p-4 md:p-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <img 
                                src={matchedProfile.imageUrl} 
                                alt={matchedProfile.name}
                                className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
                            />
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold">{matchedProfile.name}</h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 font-mono">Connected</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-cyan-300 font-mono">{formatDuration(callDuration)}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleFullscreen}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            <FullscreenIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Local Video Preview */}
            <div className="absolute bottom-24 right-4 z-40 group">
                {isVideoOff ? (
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-cyan-400/50 shadow-2xl flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-xl">📷</span>
                        </div>
                    </div>
                ) : (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-32 h-32 object-cover rounded-xl border-2 border-cyan-400/50 shadow-2xl transition-all group-hover:border-cyan-400 group-hover:shadow-cyan-500/50"
                    />
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 backdrop-blur-md border-2 border-red-500 p-6 rounded-xl text-center max-w-md z-40 shadow-2xl animate-fade-in">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="font-bold text-lg mb-2">Connection Error</p>
                    <p className="text-sm text-red-200">{error}</p>
                    <button 
                        onClick={handleEndCall}
                        className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors font-semibold"
                    >
                        Exit Call
                    </button>
                </div>
            )}

            {/* Control Bar - Bottom */}
            <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-md p-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Main Controls */}
                        <div className="flex items-center justify-center gap-4 md:gap-6">
                            {/* Microphone Toggle */}
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
                                    {isMuted ? <MicOffIcon /> : <MicOnIcon />}
                                </button>
                                <span className="text-xs text-gray-400 font-medium">{isMuted ? 'Muted' : 'Mic'}</span>
                            </div>

                            {/* Video Toggle */}
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
                                    {isVideoOff ? <VideoOffIcon /> : <VideoOnIcon />}
                                </button>
                                <span className="text-xs text-gray-400 font-medium">{isVideoOff ? 'Off' : 'Video'}</span>
                            </div>

                            {/* End Call - Larger and More Prominent */}
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={handleEndCall}
                                    className="p-5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full transition-all duration-200 shadow-xl hover:shadow-red-500/50 hover:scale-110"
                                    title="End Call"
                                >
                                    <EndCallIcon />
                                </button>
                                <span className="text-xs text-red-400 font-medium">End</span>
                            </div>

                            {/* Switch Camera */}
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={handleSwitchCamera}
                                    className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
                                    title="Switch Camera"
                                >
                                    <SwitchCameraIcon />
                                </button>
                                <span className="text-xs text-gray-400 font-medium">Switch</span>
                            </div>
                        </div>

                        {/* Connection Quality Indicator */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                            <div className="flex gap-1">
                                <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                                <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                                <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                                <div className="w-1 h-2 bg-green-400/50 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 font-mono">Excellent Connection</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tap to show controls hint */}
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

export default VideoChatView;
