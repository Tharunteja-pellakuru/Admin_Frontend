import React from 'react';
import { FileQuestion, Inbox, Search as SearchIcon } from 'lucide-react';

/**
 * EmptyState Component
 * 
 * Display when there's no data to show.
 * 
 * @param {Object} props
 * @param {string} props.title - Main message
 * @param {string} props.description - Supporting text
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button/link
 * @param {'search' | 'data' | 'error'} props.variant - Type of empty state
 */
const EmptyState = ({
  title,
  description,
  icon,
  action,
  variant = 'data',
  className = '',
}) => {
  const defaultIcons = {
    search: <SearchIcon size={48} className="text-gray-300" />,
    data: <Inbox size={48} className="text-gray-300" />,
    error: <FileQuestion size={48} className="text-gray-300" />,
  };
  
  const displayIcon = icon || defaultIcons[variant];
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {displayIcon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || 'No data found'}
      </h3>
      
      {description && (
        <p className="text-gray-500 max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
