import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';

interface DashboardProps {
    currentUser: UserProfile;
    onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'new' | 'online'>('new');

    // Get all users except current user
    const allUsers = useMemo(() => {
        try {
            const users = window.localStorage.getItem('ai-lign-all-users');
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    }, []);

    // Filter out current user
    const otherUsers = useMemo(() => {
        return allUsers.filter((user: UserProfile) => user.id !== currentUser.id);
    }, [allUsers, currentUser.id]);

    // Simulate "new users" (users not yet liked/disliked by current user)
    const newUsers = useMemo(() => {
        return otherUsers.filter((user: UserProfile) => 
            !currentUser.likes.includes(user.id) && 
            !currentUser.dislikes.includes(user.id)
        ).slice(0, 6);
    }, [otherUsers, currentUser.likes, currentUser.dislikes]);

    // Simulate "online users" (random selection for demo)
    const onlineUsers = useMemo(() => {
        return otherUsers
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
    }, [otherUsers]);

    const displayedUsers = activeTab === 'new' ? newUsers : onlineUsers;

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/60 to-blue-950/60"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDMpIj48L3BhdGg+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-6 md:p-10">
                {/* Premium Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="animate-fade-in">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center">
                                    <span className="text-xl">👑</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-cyan-300 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
                                    Welcome back
                                </h1>
                                <p className="text-lg font-semibold text-gray-300 mt-0.5">{currentUser.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-cyan-300/70 mt-2 font-medium tracking-wide">
                            ✨ Your premium dating experience awaits
                        </p>
                    </div>
                </div>

                {/* Premium Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 animate-fade-in" style={{ animationDelay: '50ms' }}>
                    <button
                        onClick={() => onNavigate('search')}
                        className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 transition-all shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] border border-emerald-400/20 hover:border-emerald-400/40"
                    >
                        <div className="relative z-10">
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🔍</div>
                            <h3 className="text-2xl font-black mb-2 text-white">Search</h3>
                            <p className="text-sm text-emerald-50/90 font-medium">Advanced filters & discovery</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-1/2 -right-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('groupChat')}
                        className="group relative overflow-hidden bg-gradient-to-br from-fuchsia-600 via-purple-600 to-pink-600 rounded-3xl p-8 transition-all shadow-2xl hover:shadow-fuchsia-500/30 hover:scale-[1.02] border border-fuchsia-400/20 hover:border-fuchsia-400/40"
                    >
                        <div className="relative z-10">
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">📹</div>
                            <h3 className="text-2xl font-black mb-2 text-white">Cam Room</h3>
                            <p className="text-sm text-purple-50/90 font-medium">Live video connections</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-1/2 -right-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('swiping')}
                        className="group relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl p-8 transition-all shadow-2xl hover:shadow-cyan-500/30 hover:scale-[1.02] border border-cyan-400/20 hover:border-cyan-400/40"
                    >
                        <div className="relative z-10">
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">💝</div>
                            <h3 className="text-2xl font-black mb-2 text-white">Matchmaking</h3>
                            <p className="text-sm text-blue-50/90 font-medium">Find your perfect match</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-1/2 -right-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    </button>
                </div>

                {/* Premium User Thumbnails Section */}
                <div className="flex-grow overflow-hidden flex flex-col bg-black/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                    <div className="flex space-x-2 mb-6">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex-1 py-4 px-6 rounded-2xl font-black text-lg transition-all relative overflow-hidden ${
                                activeTab === 'new'
                                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-2xl shadow-cyan-500/50'
                                    : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-900/70 border border-white/10'
                            }`}
                        >
                            {activeTab === 'new' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            )}
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                                <span>✨</span>
                                <span>New ({newUsers.length})</span>
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('online')}
                            className={`flex-1 py-4 px-6 rounded-2xl font-black text-lg transition-all relative overflow-hidden ${
                                activeTab === 'online'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/50'
                                    : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-900/70 border border-white/10'
                            }`}
                        >
                            {activeTab === 'online' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            )}
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                                <span>🟢</span>
                                <span>Online ({onlineUsers.length})</span>
                            </span>
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto no-scrollbar">
                        {displayedUsers.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🕸️</div>
                                <p className="text-gray-400 font-medium text-lg">No users available at the moment</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {displayedUsers.map((user: UserProfile) => (
                                    <div 
                                        key={user.id} 
                                        className="group relative bg-gradient-to-b from-gray-900/80 to-gray-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 hover:scale-[1.05] transition-all cursor-pointer shadow-xl hover:shadow-cyan-500/20"
                                        onClick={() => onNavigate('swiping')}
                                    >
                                        <div className="relative aspect-square">
                                            <img 
                                                src={user.imageUrl} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            {activeTab === 'online' && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 relative z-10">
                                            <div className="font-black text-sm text-white truncate mb-1">{user.name}, {user.age}</div>
                                            {user.lookingFor && (
                                                <div className="flex items-center text-xs text-gray-300">
                                                    <span className="text-base mr-1">
                                                        {user.lookingFor === 'fun' && '😊'}
                                                        {user.lookingFor === 'webcam' && '🔥'}
                                                        {user.lookingFor === 'connection' && '💝'}
                                                        {user.lookingFor === 'hookup' && '🔥💋'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

