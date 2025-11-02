import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileDetailProps {
    profile: UserProfile;
    currentUser: UserProfile | null;
    onClose: () => void;
    onStartChat?: () => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, currentUser, onClose, onStartChat }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Show different images based on if viewing own profile or someone else's
    const allImages = currentUser && currentUser.id === profile.id
        ? [profile.imageUrl, ...(profile.privatePhotos || [])]
        : profile.unlockedPhotos && currentUser && profile.unlockedPhotos[currentUser.id]
            ? [profile.imageUrl, ...profile.unlockedPhotos[currentUser.id]]
            : [profile.imageUrl];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-800/95 border border-white/20 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-cyan-300">{profile.name}'s Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
                    {/* Image Gallery */}
                    <div className="relative mb-6">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={`${profile.name} ${currentImageIndex + 1}`}
                            className="w-full h-96 object-cover rounded-xl border border-white/20"
                        />
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-xs text-white">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="mb-6">
                        <h3 className="text-3xl font-bold mb-2">{profile.name}, <span className="font-light">{profile.age}</span></h3>
                        <p className="text-gray-400">{profile.viewCount || 0} profile views</p>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-cyan-300 mb-3">About</h4>
                        <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                    </div>

                    {/* Interests */}
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-fuchsia-400 mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                                <span key={index} className="bg-fuchsia-400/20 text-fuchsia-300 text-sm font-mono px-3 py-1 rounded-full">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                {onStartChat && (
                    <div className="p-6 border-t border-white/10 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onStartChat}
                            className="flex-1 font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-cyan-500/50"
                        >
                            Start Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDetail;

