import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  icon: Icon,
  className = '',
  name,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || (name ? `input-${name}` : `input-${generatedId}`);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const ariaDescribedBy = [
    error ? errorId : null,
    helperText ? helperId : null
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label d-flex justify-content-between">
          <span>
            {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="position-relative">
        {Icon && (
          <div
            className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"
            style={{ pointerEvents: 'none' }}
          >
            <Icon size={18} />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={ariaDescribedBy}
            className={`form-control ${error ? 'is-invalid' : ''} ${Icon ? 'ps-5' : ''}`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={ariaDescribedBy}
            className={`form-select ${error ? 'is-invalid' : ''} ${Icon ? 'ps-5' : ''}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={ariaDescribedBy}
            className={`form-control ${error ? 'is-invalid' : ''} ${Icon ? 'ps-5' : ''}`}
            {...props}
          />
        )}
      </div>

      {helperText && !error && (
        <small id={helperId} className="form-text text-muted mt-1 d-block">
          {helperText}
        </small>
      )}

      {error && (
        <div id={errorId} className="invalid-feedback d-flex align-items-center gap-1 mt-1" role="alert">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
