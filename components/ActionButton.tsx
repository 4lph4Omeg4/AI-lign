
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  variant: 'accept' | 'reject';
  children: React.ReactNode;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, variant, children, disabled = false }) => {
  const baseClasses = "p-4 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:scale-110 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  const variantClasses = variant === 'accept' 
    ? "bg-gradient-to-br from-green-400 to-cyan-500 text-white focus:ring-cyan-300/50"
    : "bg-gradient-to-br from-red-500 to-fuchsia-600 text-white focus:ring-fuchsia-300/50";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`} disabled={disabled}>
      {children}
    </button>
  );
};

export default ActionButton;
