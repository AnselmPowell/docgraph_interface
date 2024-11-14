// src/app/components/ui/Toast.client.jsx
'use client';

import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export const toast = {
  success: (message) => createToast(message, 'success'),
  error: (message) => createToast(message, 'error'),
  info: (message) => createToast(message, 'info'),
};

let toasts = new Set();
const MAX_TOASTS = 5;
const TOAST_SPACING = 16;

function createToast(message, type) {
  const id = Date.now();
  const containerEl = document.createElement('div');
  containerEl.id = `toast-${id}`;
  
  const position = toasts.size;
  
  if (position >= MAX_TOASTS) {
    const oldestToast = toasts.values().next().value;
    oldestToast.close();
  }

  document.body.appendChild(containerEl);
  const root = createRoot(containerEl);
  
  const close = () => {
    toasts.delete({ id, close });
    root.unmount();
    containerEl.remove();
    repositionToasts();
  };

  toasts.add({ id, close });

  root.render(
    <ToastComponent 
      message={message} 
      type={type} 
      position={position}
      onClose={close} 
      id={id}
    />
  );
}

function repositionToasts() {
  const toastElements = document.querySelectorAll('[data-toast]');
  toastElements.forEach((el, index) => {
    const yOffset = index * (el.offsetHeight + TOAST_SPACING);
    el.style.bottom = `${16 + yOffset}px`;
  });
}

const icons = {
  success: <CheckCircle2 className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <AlertCircle className="w-5 h-5" />,
};

function getToastStyles(type) {
  const baseStyles = `
    fixed right-4 z-50
    min-w-[320px] max-w-md
    backdrop-blur-md
    rounded-lg
    shadow-lg
    overflow-hidden
    border
    transition-all duration-300
    transform translate-x-full
    opacity-0
  `;

  const typeStyles = {
    success: `
      bg-background/95
      border-accent
      text-primary
    `,
    error: `
      bg-background/95
      border-primary
      text-primary
    `,
    info: `
      bg-background/95
      border-secondary
      text-primary
    `,
  };

  return `${baseStyles} ${typeStyles[type]}`;
}

function ToastComponent({ message, type, onClose, id }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    repositionToasts();
    
    const el = document.querySelector(`[data-toast="${id}"]`);
    if (el) {
      setTimeout(() => {
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
      }, 50);
    }
    
    return () => repositionToasts();
  }, [id]);

  const iconColors = {
    success: 'text-accent',
    error: 'text-primary',
    info: 'text-secondary',
  };

  return (
    <div
      data-toast={id}
      className={getToastStyles(type)}
    >
      <div className="flex items-center gap-3 p-4">
        <div className={`shrink-0 ${iconColors[type]}`}>
          {icons[type]}
        </div>
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button
          onClick={onClose}
          className={`
            shrink-0 
            hover:text-primary 
            text-tertiary
            rounded-full
            p-1
            hover:bg-primary/5
            transition-all
            duration-200
          `}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}