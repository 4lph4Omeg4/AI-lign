import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';

interface SearchUsersProps {
    currentUser: UserProfile;
    onGoBack: () => void;
    onStartChat: (profile: UserProfile) => void;
    onBlock: (profile: UserProfile) => void;
}

const SearchUsers: React.FC<SearchUsersProps> = ({ currentUser, onGoBack, onStartChat, onBlock }) => {
    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(45);
    const [lookingForFilter, setLookingForFilter] = useState<'all' | 'fun' | 'webcam' | 'connection' | 'hookup'>('all');
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say'>('all');

    // Get all users except current user
    const allUsers = useMemo(() => {
        try {
            const users = window.localStorage.getItem('ai-lign-all-users');
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    }, []);

    // Filter users based on criteria
    const filteredUsers = useMemo(() => {
        return allUsers.filter((user: UserProfile) => {
            // Filter out current user
            if (user.id === currentUser.id) return false;
            
            // Filter by age range
            if (user.age < ageMin || user.age > ageMax) return false;
            
            // Filter by "looking for" if specified
            if (lookingForFilter !== 'all' && user.lookingFor !== lookingForFilter) return false;
            
            // Filter by gender if specified
            if (genderFilter !== 'all' && user.gender !== genderFilter) return false;
            
            return true;
        });
    }, [allUsers, currentUser.id, ageMin, ageMax, lookingForFilter, genderFilter]);

    const GENDER_OPTIONS = [
        { value: 'all', label: 'All', emoji: '🌍' },
        { value: 'male', label: 'Male', emoji: '👨' },
        { value: 'female', label: 'Female', emoji: '👩' },
        { value: 'non-binary', label: 'Non-Binary', emoji: '⚧️' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤐' },
    ];

    const LOOKING_FOR_OPTIONS = [
        { value: 'all', label: 'All', emoji: '🌍' },
        { value: 'fun', label: 'Just a Fun Chat', emoji: '😊' },
        { value: 'webcam', label: 'Webcam Tease & Release', emoji: '🔥' },
        { value: 'connection', label: 'Lasting Deeper Connection', emoji: '💝' },
        { value: 'hookup', label: 'Hot Hookup in Reality', emoji: '🔥💋' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button onClick={onGoBack} className="text-cyan-300 hover:text-cyan-100 transition-colors p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold ml-4 text-cyan-300">Search Users</h2>
                    </div>
                    <div className="text-sm text-gray-400">
                        {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
                    {/* Age Range */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-cyan-400 mb-4">Age Range</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-400 mb-2 block">Min: {ageMin}</label>
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={ageMin}
                                    onChange={(e) => setAgeMin(parseInt(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-400 mb-2 block">Max: {ageMax}</label>
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={ageMax}
                                    onChange={(e) => setAgeMax(parseInt(e.target.value))}
                                    className="w-full accent-fuchsia-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gender Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-blue-400 mb-4">Gender</label>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {GENDER_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setGenderFilter(option.value as any)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        genderFilter === option.value
                                            ? 'border-blue-400 bg-blue-400/20'
                                            : 'border-white/20 hover:border-blue-400/50'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{option.emoji}</div>
                                    <div className="text-xs font-semibold">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Looking For Filter */}
                    <div>
                        <label className="block text-sm font-bold text-fuchsia-400 mb-4">Looking For</label>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {LOOKING_FOR_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setLookingForFilter(option.value as any)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        lookingForFilter === option.value
                                            ? 'border-fuchsia-400 bg-fuchsia-400/20'
                                            : 'border-white/20 hover:border-fuchsia-400/50'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{option.emoji}</div>
                                    <div className="text-xs font-semibold">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-grow overflow-y-auto no-scrollbar">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-mono">
                            <p>No users match your criteria.</p>
                            <p className="mt-2">Try adjusting your filters!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredUsers.map((user: UserProfile) => (
                                <div key={user.id} className="bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all animate-fade-in-up">
                                    <img src={user.imageUrl} alt={user.name} className="w-full h-64 object-cover" />
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg">{user.name}, {user.age}</h3>
                                            <div className="flex items-center space-x-1">
                                                {user.gender && (
                                                    <span className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded-full">
                                                        {user.gender === 'male' && '👨'}
                                                        {user.gender === 'female' && '👩'}
                                                        {user.gender === 'non-binary' && '⚧️'}
                                                    </span>
                                                )}
                                                {user.lookingFor && (
                                                    <span className="text-xs bg-fuchsia-400/20 text-fuchsia-400 px-2 py-1 rounded-full">
                                                        {user.lookingFor === 'fun' && '😊'}
                                                        {user.lookingFor === 'webcam' && '🔥'}
                                                        {user.lookingFor === 'connection' && '💝'}
                                                        {user.lookingFor === 'hookup' && '🔥💋'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{user.bio}</p>
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {user.interests.slice(0, 3).map((interest, i) => (
                                                <span key={i} className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded-full">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onStartChat(user)}
                                                className="flex-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                                            >
                                                Chat
                                            </button>
                                            <button
                                                onClick={() => onBlock(user)}
                                                className="p-2 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                title="Block"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUsers;

