import React, { useState } from 'react';
import { UserProfile } from '../types';
import CompatibilityScore from './CompatibilityScore';

interface ProfileCardProps {
  profile: UserProfile;
  userProfile: UserProfile | null;
  onBlock: (profile: UserProfile) => void;
}

const Chip: React.FC<{ text: string }> = ({ text }) => (
    <span className="bg-cyan-400/20 text-cyan-300 text-xs font-mono px-3 py-1 rounded-full whitespace-nowrap">
        {text}
    </span>
);

const BanIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FlipBackIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const calculateCompatibility = (user: UserProfile, candidate: UserProfile): number => {
    if (!user?.interests) return 0;

    const userInterests = new Set(user.interests.map(i => i.trim().toLowerCase()));
    const candidateInterests = new Set(candidate.interests.map(i => i.trim().toLowerCase()));
    
    let commonInterestsCount = 0;
    for (const interest of userInterests) {
        if (candidateInterests.has(interest)) {
            commonInterestsCount++;
        }
    }

    const baseScore = 30;
    const scoreFromInterests = commonInterestsCount * 15;
    
    return Math.min(baseScore + scoreFromInterests, 99);
};


export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, userProfile, onBlock }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const compatibilityScore = userProfile ? calculateCompatibility(userProfile, profile) : 0;

    const handleBlockClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card from flipping when blocking
        onBlock(profile);
    };

    return (
        <div 
            className="absolute inset-0 animate-fade-in-up [perspective:1200px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div 
                className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            >
                {/* CARD FRONT */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/20 bg-gray-800/50">
                    <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
                    
                    {/* Info icon in top left */}
                    <div className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white/70 backdrop-blur-sm pointer-events-none" title="View more details">
                        <InfoIcon />
                    </div>
                    
                    {/* Block button in top right */}
                    <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                        <button onClick={handleBlockClick} title={`Block ${profile.name}`} className="p-2 rounded-full bg-black/40 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors backdrop-blur-sm">
                            <BanIcon />
                        </button>
                    </div>
                    
                    <div className="absolute bottom-0 p-6 text-white w-full">
                         <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <h2 className="text-3xl font-bold">{profile.name}, <span className="font-light">{profile.age}</span></h2>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                 {userProfile && <CompatibilityScore score={compatibilityScore} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD BACK */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-gray-900 via-purple-900/90 to-blue-900/90 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/20 p-6 flex flex-col">
                    {/* Block button in top right */}
                    <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                        <button onClick={handleBlockClick} title={`Block ${profile.name}`} className="p-2 rounded-full bg-black/40 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors backdrop-blur-sm">
                            <BanIcon />
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto no-scrollbar pr-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">About Me</h3>
                        <p className="mt-2 text-gray-300 text-sm leading-relaxed font-sans">{profile.bio}</p>
                        
                        <h3 className="mt-6 text-2xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">Interests</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {profile.interests.map(interest => <Chip key={interest} text={interest} />)}
                        </div>
                        
                        {profile.privatePhotos && profile.privatePhotos.length > 0 && userProfile && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <h3 className="text-lg font-bold text-fuchsia-400/80 font-mono tracking-wider">🔒 Private Photos</h3>
                                <div className="text-xs text-gray-400 mt-2 mb-3">
                                    {userProfile.id === profile.id 
                                        ? `${profile.privatePhotos.length} private ${profile.privatePhotos.length === 1 ? 'photo' : 'photos'}`
                                        : profile.unlockedPhotos && profile.unlockedPhotos[userProfile.id] && profile.unlockedPhotos[userProfile.id].length > 0
                                            ? `${profile.unlockedPhotos[userProfile.id].length} photo(s) unlocked`
                                            : `${profile.privatePhotos.length} photo(s) locked`}
                                </div>
                                {userProfile.id !== profile.id && profile.unlockedPhotos && profile.unlockedPhotos[userProfile.id] && (
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {profile.unlockedPhotos[userProfile.id].map((photoUrl, index) => (
                                            <img key={index} src={photoUrl} alt={`Unlocked ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-fuchsia-400/30" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <h3 className="text-lg font-bold text-gray-400/80 font-mono tracking-wider">Profile Views</h3>
                            <div className="flex items-center mt-3 text-gray-300">
                                <EyeIcon />
                                <span className="ml-2 text-sm font-sans">{(profile.viewCount || 0).toLocaleString()} views</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-5 right-5 p-2 rounded-full bg-black/40 text-white/70 backdrop-blur-sm pointer-events-none" title="Return to photo">
                        <FlipBackIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};
