import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AlertNotification = ({ type = 'info', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className={`alert-toast ${isSuccess ? 'alert-success' : isError ? 'alert-error' : 'alert-info'}`}>
      {isSuccess && <CheckCircle2 size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AlertNotification;
