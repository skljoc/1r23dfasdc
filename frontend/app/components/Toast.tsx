import React from 'react';

interface ToastProps {
  error: string | null;
}

const Toast: React.FC<ToastProps> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 dark:bg-red-700 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-semibold text-base drop-shadow-lg" role="alert" aria-live="assertive">
      {error}
    </div>
  );
};

export default Toast;
