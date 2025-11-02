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
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
                            Welcome back, {currentUser.name}
                        </h1>
                        <p className="text-sm text-cyan-300/80 mt-1 font-mono">
                            Ready to find your frequency?
                        </p>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('search')}
                        className="group relative bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl p-6 transition-all shadow-lg hover:shadow-green-500/50 animate-fade-in-up"
                        style={{ animationDelay: '0ms' }}
                    >
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="text-xl font-bold mb-2">Search Users</h3>
                        <p className="text-sm text-green-100/80">Find profiles by filters</p>
                        <div className="absolute inset-0 rounded-2xl border-2 border-green-400/0 group-hover:border-green-400/50 transition-colors"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('groupChat')}
                        className="group relative bg-gradient-to-br from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-2xl p-6 transition-all shadow-lg hover:shadow-purple-500/50 animate-fade-in-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="text-4xl mb-3">📹</div>
                        <h3 className="text-xl font-bold mb-2">Cam Room</h3>
                        <p className="text-sm text-purple-100/80">Join video sessions</p>
                        <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/0 group-hover:border-purple-400/50 transition-colors"></div>
                    </button>

                    <button
                        onClick={() => onNavigate('swiping')}
                        className="group relative bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl p-6 transition-all shadow-lg hover:shadow-cyan-500/50 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="text-4xl mb-3">💝</div>
                        <h3 className="text-xl font-bold mb-2">Matchmaking</h3>
                        <p className="text-sm text-cyan-100/80">Start swiping now</p>
                        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/0 group-hover:border-cyan-400/50 transition-colors"></div>
                    </button>
                </div>

                {/* User Thumbnails Section */}
                <div className="flex-grow overflow-hidden flex flex-col">
                    <div className="flex space-x-1 mb-4 bg-gray-800/30 backdrop-blur-xl rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                                activeTab === 'new'
                                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            ✨ New Users ({newUsers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('online')}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                                activeTab === 'online'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            🟢 Online Now ({onlineUsers.length})
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto no-scrollbar">
                        {displayedUsers.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 font-mono">
                                <p>No users available at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {displayedUsers.map((user: UserProfile) => (
                                    <div 
                                        key={user.id} 
                                        className="group bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all cursor-pointer animate-fade-in-up"
                                        onClick={() => onNavigate('swiping')}
                                    >
                                        <div className="relative aspect-square">
                                            <img 
                                                src={user.imageUrl} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover" 
                                            />
                                            {activeTab === 'online' && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div className="font-bold text-sm truncate">{user.name}, {user.age}</div>
                                            {user.lookingFor && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {user.lookingFor === 'fun' && '😊'}
                                                    {user.lookingFor === 'webcam' && '🔥'}
                                                    {user.lookingFor === 'connection' && '💝'}
                                                    {user.lookingFor === 'hookup' && '🔥💋'}
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

