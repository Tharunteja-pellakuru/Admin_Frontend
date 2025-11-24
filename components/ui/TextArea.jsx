import React, { forwardRef } from 'react';

/**
 * TextArea Component
 * 
 * A textarea component with character count and validation states.
 * 
 * @param {Object} props
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Helper text
 * @param {boolean} props.required - Show required indicator
 * @param {number} props.maxLength - Maximum character count
 * @param {boolean} props.showCount - Show character counter
 */
const TextArea = forwardRef(({
  label,
  error,
  helpText,
  required = false,
  maxLength,
  showCount = false,
  className = '',
  value = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed resize-y';
  
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const textareaClasses = `${baseStyles} px-4 py-2 text-base ${stateStyles} ${className}`;
  
  const currentLength = value?.length || 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.9;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={textareaClasses}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      
      <div className="flex justify-between items-start mt-1.5">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {helpText && !error && (
            <p className="text-sm text-gray-500">{helpText}</p>
          )}
        </div>
        
        {(showCount || maxLength) && (
          <p className={`text-sm ml-2 flex-shrink-0 ${isNearLimit ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
            {currentLength}{maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
