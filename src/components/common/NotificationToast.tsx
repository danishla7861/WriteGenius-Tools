import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-lg border text-sm transition-all duration-200 transform translate-y-0 ${
        isSuccess
          ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-950 dark:border-slate-200'
          : 'bg-red-900 text-white border-red-800'
      }`}
    >
      <div className="flex items-center gap-2.5 mr-2">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
        )}
        <span className="font-medium text-xs leading-normal">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white dark:hover:text-slate-900 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
