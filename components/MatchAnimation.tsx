import React from 'react';

const MatchAnimation: React.FC = () => {
    const particles = Array.from({ length: 20 });

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Glow Effect */}
            <div className="absolute inset-[-4px] md:inset-[-8px] rounded-[32px] animate-match-glow"></div>

            {/* Text */}
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 text-transparent bg-clip-text animate-match-text" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
                MATCH!
            </h1>

            {/* Particles */}
            {particles.map((_, i) => {
                const size = Math.random() * 5 + 3;
                const duration = 0.8 + Math.random() * 0.7;
                const delay = Math.random() * 0.5;
                const angle = Math.random() * 360;
                const distance = Math.random() * 80 + 120; // in pixels
                const colors = ['bg-cyan-400', 'bg-fuchsia-500', 'bg-white'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                return (
                    <div
                        key={i}
                        className={`absolute top-1/2 left-1/2 rounded-full ${color} animate-particle-burst`}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            '--angle': `${angle}deg`,
                            '--distance': `${distance}px`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

export default MatchAnimation;
