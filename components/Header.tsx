import React from 'react';

interface HeaderProps {
    onShowModelsClick?: () => void;
    showModelsButton?: boolean;
    onDarkRoomClick?: () => void;
    showDarkRoomButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShowModelsClick, showModelsButton = false, onDarkRoomClick, showDarkRoomButton = false }) => {
  return (
    <header className="py-6 text-center relative">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
        AI-lign
      </h1>
      <p className="text-sm text-cyan-300/80 mt-2 font-mono tracking-widest">
        Find Your Frequency
      </p>
      
      {/* Left side - Dark Room button */}
      {showDarkRoomButton && (
        <button 
            onClick={onDarkRoomClick} 
            className="absolute top-1/2 left-0 md:left-4 -translate-y-1/2 p-2 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg hover:shadow-purple-500/50 animate-pulse hover:animate-none" 
            title="Join Dark Room 🌙"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-bounce">
                {3 + Math.floor(Math.random() * 7)}
            </span>
        </button>
      )}

      {/* Right side - Matches button */}
      {showModelsButton && (
        <button 
            onClick={onShowModelsClick} 
            className="absolute top-1/2 right-0 md:right-4 -translate-y-1/2 p-2 rounded-full text-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-100 transition-colors" 
            title="View Your Matches"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
