import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X,
  Bell
} from 'lucide-react';

// Toast Provider Context
const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = {
    success: (title, description, options = {}) => 
      addToast({ type: 'success', title, description, ...options }),
    error: (title, description, options = {}) => 
      addToast({ type: 'error', title, description, ...options }),
    warning: (title, description, options = {}) => 
      addToast({ type: 'warning', title, description, ...options }),
    info: (title, description, options = {}) => 
      addToast({ type: 'info', title, description, ...options })
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (toast.duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration]);

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          progressColor: 'bg-green-500'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          progressColor: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          progressColor: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 relative overflow-hidden`}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
        <motion.div
          className={`h-full ${config.progressColor}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${config.titleColor}`}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={`text-sm mt-1 ${config.textColor}`}>
              {toast.description}
            </p>
          )}
          
          {/* Actions */}
          {toast.actions && (
            <div className="flex gap-2 mt-3">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    onRemove(toast.id);
                  }}
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    action.primary 
                      ? `${config.progressColor} text-white hover:opacity-90`
                      : `${config.textColor} hover:underline`
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className={`${config.iconColor} hover:opacity-70 flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Standalone Toast Component (for direct use)
export default function Toasts({ toasts = [], onRemove = () => {} }) {
  return <ToastContainer toasts={toasts} onRemove={onRemove} />;
}

// Utility functions for standalone usage
export const createToast = {
  success: (title, description) => ({
    id: Math.random().toString(36).substr(2, 9),
    type: 'success',
    title,
    description,
    duration: 5000
  }),
  error: (title, description) => ({
    id: Math.random().toString(36).substr(2, 9),
    type: 'error',
    title,
    description,
    duration: 7000
  }),
  warning: (title, description) => ({
    id: Math.random().toString(36).substr(2, 9),
    type: 'warning',
    title,
    description,
    duration: 6000
  }),
  info: (title, description) => ({
    id: Math.random().toString(36).substr(2, 9),
    type: 'info',
    title,
    description,
    duration: 5000
  })
};