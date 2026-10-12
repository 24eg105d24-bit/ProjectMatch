import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMaxWidth = () => {
    switch (size) {
      case 'lg':
        return '720px';
      case 'xl':
        return '900px';
      case 'sm':
        return '420px';
      case 'md':
      default:
        return '540px';
    }
  };

  return (
    <div
      className="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(6, 11, 25, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="pm-card bg-white w-100 shadow-xl fade-in"
        style={{ maxWidth: getMaxWidth(), maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
          <div>
            <h5 id="modal-title" className="mb-0 fw-bold text-navy">
              {title}
            </h5>
            {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-2 text-muted"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">{children}</div>

        {footer && <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
