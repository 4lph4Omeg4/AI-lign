import React, { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../types';

interface VideoChatViewProps {
    userProfile: UserProfile;
    matchedProfile: UserProfile;
    onEndCall: () => void;
}

const EndCallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.59 1.322a1 1 0 011.053.056l1.769 1.378a1 1 0 01.328.948v3.456c0 .414-.24.786-.6.957l-2.458 1.15a1 1 0 01-1.353-.646L1.01 5.408a1 1 0 01.646-1.353l2.458-1.15a1 1 0 01.475-.583zM21.73.96a1 1 0 01.328.948l-1.272 4.21a1 1 0 01-1.353.646L17.2 5.611a1 1 0 01-.6-.957V1.2c0-.414.24-.786.6-.957l2.458-1.15a1 1 0 011.525.867z" transform="translate(0 7.5)" />
        <path d="M16.5 6.5a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" opacity=".5" transform="translate(-1 1)" />
        <path d="M2.37,13.84c0.11,1.88,1.2,5.13,5.78,5.85c4.7,0.73,6.3-1.8,6.3-1.8s2.33,1.63,6.13,0.7c2.43-0.6,2.83-2.93,2.54-4.51 c-0.29-1.58-1.13-3.04-2.54-3.51c-1.41-0.47-3.13-0.2-4.59,0.58c-1.46,0.78-2.6,2.28-2.6,2.28s-1.03-1.42-2.39-2.19 C9.21,9.8,7.74,9.63,6.48,10.04c-1.26,0.41-2.2,1.68-2.46,3.03C3.96,13.23,3.96,13.37,2.37,13.84z" />
    </svg>
);
const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7.5 7.5 0 01-7.5 7.5m-7.5-7.5a7.5 7.5 0 017.5 7.5m-7.5-7.5h.01M12 18.75a7.5 7.5 0 007.5-7.5h-15a7.5 7.5 0 007.5 7.5zM12 3v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
);
const UnmuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7.5 7.5 0 01-7.5 7.5m-7.5-7.5a7.5 7.5 0 017.5 7.5m-7.5-7.5h.01M12 18.75a7.5 7.5 0 007.5-7.5h-15a7.5 7.5 0 007.5 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01" />
    </svg>
);

const VideoChatView: React.FC<VideoChatViewProps> = ({ matchedProfile, onEndCall }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            // Cleanup: stop all tracks when the component unmounts
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
    
    const handleEndCall = () => {
        localStream?.getTracks().forEach(track => track.stop());
        onEndCall();
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative animate-fade-in">
            {/* Remote Video (Simulated) */}
            <video
                src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-woman-in-a-dark-room-41311-large.mp4"
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            <div className="relative z-20 w-full h-full flex flex-col p-4 md:p-8">
                {/* Header Info */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold">{matchedProfile.name}</h2>
                    <p className="text-green-400 font-mono">&lt;VISUAL LINK ACTIVE&gt;</p>
                </div>

                {/* Local Video */}
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute bottom-20 md:bottom-28 right-4 w-32 h-48 md:w-48 md:h-64 object-cover rounded-lg border-2 border-cyan-400 shadow-lg"
                />
                
                {error && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/80 border border-red-500 p-4 rounded-lg text-center">
                         <p className="font-bold">Stream Error</p>
                         <p className="text-sm mt-2">{error}</p>
                     </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/20">
                    <button onClick={handleToggleMute} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                    </button>
                    <button onClick={handleEndCall} className="p-4 bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg">
                        <EndCallIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoChatView;
