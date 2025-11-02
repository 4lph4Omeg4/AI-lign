import React from 'react';

interface WebcamMenuProps {
    currentUser: any;
    onSelectMode: (mode: 'group' | 'random') => void;
    onGoBack: () => void;
}

const WebcamMenu: React.FC<WebcamMenuProps> = ({ currentUser, onSelectMode, onGoBack }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button onClick={onGoBack} className="text-cyan-300 hover:text-cyan-100 transition-colors p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">
                        Webcam Options
                    </h1>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Anonymous Group Chat Option */}
                        <div 
                            onClick={() => onSelectMode('group')}
                            className="bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all cursor-pointer group hover:scale-105 animate-fade-in-up"
                        >
                            <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">👥</div>
                            <h2 className="text-2xl font-bold text-cyan-300 mb-3 text-center">Anonymous Group Chat</h2>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Join a group of 3-12 anonymous strangers</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>People join and leave randomly</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>No registration or names required</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Fun, low-pressure environment</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/50">
                                    Join Group Chat
                                </button>
                            </div>
                        </div>

                        {/* Random 1-on-1 Option */}
                        <div 
                            onClick={() => onSelectMode('random')}
                            className="bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-fuchsia-400/50 transition-all cursor-pointer group hover:scale-105 animate-fade-in-up"
                            style={{ animationDelay: '100ms' }}
                        >
                            <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">🔀</div>
                            <h2 className="text-2xl font-bold text-fuchsia-400 mb-3 text-center">Random Anonymous Webcam</h2>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Connect 1-on-1 with random strangers</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>100% anonymous - no names</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Like or pass your partner</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Instant connection, instant decision</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-400 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-fuchsia-500/50">
                                    Start Random Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WebcamMenu;

