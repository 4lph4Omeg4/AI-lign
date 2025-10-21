import React from 'react';
import { UserProfile } from '../types';
import Header from './Header';

interface CompatibleModelsProps {
    matches: UserProfile[];
    onStartConversation: (profile: UserProfile) => void;
    onGoBack: () => void;
    onBlock: (profile: UserProfile) => void;
    onEditProfile: () => void;
}

const BanIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);


const CompatibleModels: React.FC<CompatibleModelsProps> = ({ matches, onStartConversation, onGoBack, onBlock, onEditProfile }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8 animate-fade-in">
                <Header />
                <main className="flex-grow flex flex-col items-center mt-8">
                     <div className="w-full max-w-lg bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <button onClick={onGoBack} className="text-cyan-300 hover:text-cyan-100 transition-colors p-2 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h2 className="text-2xl font-bold text-cyan-300">Your Matches</h2>
                            </div>
                            <button onClick={onEditProfile} title="Edit Your Profile" className="text-cyan-300 hover:text-cyan-100 transition-colors p-2 rounded-full">
                                <EditIcon />
                            </button>
                        </div>
                       
                        {matches.length > 0 ? (
                             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                                {matches.map(profile => (
                                    <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg animate-fade-in-up">
                                        <div className="flex items-center">
                                            <img src={profile.imageUrl} alt={profile.name} className="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-500" />
                                            <div className="ml-4">
                                                <h3 className="font-semibold flex items-center">
                                                    {profile.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">{profile.age} years old</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => onStartConversation(profile)}
                                                className="font-semibold text-sm py-2 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:shadow-md hover:shadow-cyan-500/40"
                                            >
                                                Chat
                                            </button>
                                            <button onClick={() => onBlock(profile)} title={`Block ${profile.name}`} className="p-2 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                                <BanIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 text-gray-500 font-mono">
                                <p>You haven't matched with anyone yet.</p>
                                <p className="mt-2">Keep swiping!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompatibleModels;
