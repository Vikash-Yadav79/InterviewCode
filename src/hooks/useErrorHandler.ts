
import { useState, useCallback } from 'react';

interface ErrorState {
  visible: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info' | 'confirm';
  onConfirm?: () => void;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showError = useCallback((title: string, message: string) => {
    setErrorState({
      visible: true,
      title,
      message,
      type: 'error',
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    setErrorState({
      visible: true,
      title,
      message,
      type: 'success',
    });
  }, []);

  const showWarning = useCallback((title: string, message: string) => {
    setErrorState({
      visible: true,
      title,
      message,
      type: 'warning',
    });
  }, []);

  const showInfo = useCallback((title: string, message: string) => {
    setErrorState({
      visible: true,
      title,
      message,
      type: 'info',
    });
  }, []);

  const showConfirm = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setErrorState({
        visible: true,
        title,
        message,
        type: 'confirm',
        onConfirm,
      });
    },
    []
  );

  const hideModal = useCallback(() => {
    setErrorState((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    modalProps: {
      ...errorState,
      onClose: hideModal,
    },
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showConfirm,
    hideModal,
  };
};