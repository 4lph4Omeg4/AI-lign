
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center text-cyan-300">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 font-mono text-sm tracking-widest animate-pulse">
                SYNTHESIZING DESIRES...
            </p>
        </div>
    );
};

export default LoadingSpinner;
