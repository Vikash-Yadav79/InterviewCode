// src/context/ModalContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import CustomModal from '../components/CustomModal';

interface ModalContextType {
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const {
    modalProps,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showConfirm,
  } = useErrorHandler();

  return (
    <ModalContext.Provider
      value={{
        showError,
        showSuccess,
        showWarning,
        showInfo,
        showConfirm,
      }}
    >
      {children}
      <CustomModal {...modalProps} />
    </ModalContext.Provider>
  );
};
