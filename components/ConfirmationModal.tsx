import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gradient-to-br from-red-500 via-fuchsia-600 to-purple-600 p-1 rounded-2xl shadow-2xl max-w-sm w-11/12" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center text-red-400">
            {title}
          </h2>
          <p className="text-center text-sm text-gray-300 mt-4">
            {message}
          </p>
          <div className="mt-8 flex gap-4">
            <button
                onClick={onClose}
                className="w-full bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-red-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-red-500/50"
            >
                {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
