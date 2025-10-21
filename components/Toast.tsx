import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before calling onClose
        setTimeout(onClose, 500);
      }, 3000); // Display for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-4 bg-gray-800/80 backdrop-blur-lg border border-cyan-400/30 rounded-lg p-4 shadow-2xl shadow-black/50">
        <CheckIcon />
        <p className="text-white font-mono">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
