import React from 'react';
import { UserProfile } from '../types';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: () => void;
  currentUserProfile: UserProfile | null;
  matchedProfile: UserProfile | null;
}

const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, onStartConversation, currentUserProfile, matchedProfile }) => {
  if (!isOpen || !matchedProfile || !currentUserProfile) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-cyan-500 p-1 rounded-2xl shadow-2xl max-w-sm w-11/12" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 rounded-xl p-8 text-center text-white">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">It's a Match!</h2>
          <p className="mt-2 text-gray-300">You and {matchedProfile.name} have liked each other.</p>
          <div className="flex justify-center items-center space-x-4 my-8">
            <img src={currentUserProfile.imageUrl} alt="You" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-cyan-400 object-cover" />
            <span className="text-4xl font-thin text-fuchsia-400">&amp;</span>
            <img src={matchedProfile.imageUrl} alt={matchedProfile.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-fuchsia-500 object-cover" />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
                onClick={onStartConversation}
                className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-cyan-500/50"
            >
                Send a Message
            </button>
            <button
                onClick={onClose}
                className="w-full bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
