
import React, { useEffect, PropsWithChildren } from 'react';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-mono">
      <div className="bg-station-blue rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-station-light-blue">
          <h2 className="text-2xl font-bold text-station-pink">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
