import React, { useState } from 'react';
import { UserProfile } from '../types';

interface PickupLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pickupLine: string) => void;
  profile: UserProfile | null;
}

const PickupLineModal: React.FC<PickupLineModalProps> = ({ isOpen, onClose, onSubmit, profile }) => {
  const [line, setLine] = useState('');

  if (!isOpen || !profile) return null;

  const handleSubmit = () => {
    if (line.trim()) {
      onSubmit(line.trim());
      setLine('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-cyan-500 p-1 rounded-2xl shadow-2xl max-w-md w-11/12" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center">
            Send an Intro to <span className="text-cyan-300">{profile.name}</span>
          </h2>
          <p className="text-center text-sm text-gray-400 mt-2">
            Sending a message with your like increases your chance of matching.
          </p>
          <textarea
            value={line}
            onChange={(e) => setLine(e.target.value)}
            placeholder="Break the ice with a great opening line..."
            className="w-full h-28 mt-6 bg-gray-800/70 border border-cyan-400/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none no-scrollbar"
            maxLength={150}
          />
          <div className="text-right text-xs text-gray-500 mt-1 font-mono">
            {line.length} / 150
          </div>
          <div className="mt-6 flex gap-4">
            <button
                onClick={onClose}
                className="w-full bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={!line.trim()}
                className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50"
            >
                Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupLineModal;
