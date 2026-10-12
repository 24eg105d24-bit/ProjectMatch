import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const AlertBanner = ({
  type = 'info',
  title,
  message,
  children,
  onClose,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-warning flex-shrink-0" />;
      case 'danger':
      case 'error':
        return <AlertCircle size={18} className="text-danger flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={18} className="text-primary flex-shrink-0" />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success border-success-subtle text-dark';
      case 'warning':
        return 'alert-warning border-warning-subtle text-dark';
      case 'danger':
      case 'error':
        return 'alert-danger border-danger-subtle text-dark';
      case 'info':
      default:
        return 'alert-info border-info-subtle text-dark';
    }
  };

  return (
    <div
      role="alert"
      className={`alert ${getAlertClass()} d-flex align-items-start gap-2 rounded-3 shadow-xs ${className}`}
    >
      <div className="pt-1">{getIcon()}</div>
      <div className="flex-grow-1">
        {title && <strong className="d-block mb-1">{title}</strong>}
        {message && <div>{message}</div>}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="btn-close ms-2"
          style={{ fontSize: '0.75rem' }}
        />
      )}
    </div>
  );
};

export default AlertBanner;
