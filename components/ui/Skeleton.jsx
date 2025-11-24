import React from 'react';

/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer animation.
 * 
 * @param {Object} props
 * @param {'text' | 'title' | 'avatar' | 'thumbnail' | 'button'} props.variant - Skeleton type
 * @param {number} props.width - Custom width percentage
 * @param {number} props.height - Custom height in pixels
 * @param {number} props.count - Number of skeleton lines
 * @param {boolean} props.circle - Make it circular (for avatars)
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  circle = false,
  className = '',
}) => {
  const baseStyles = 'bg-gray-200 animate-pulse';
  
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded-lg',
    avatar: 'w-12 h-12 rounded-full',
    thumbnail: 'w-full h-48 rounded-lg',
    button: 'h-10 w-32 rounded-lg',
  };
  
  const skeletonClasses = circle 
    ? `${baseStyles} rounded-full`
    : `${baseStyles} ${variants[variant]} ${className}`;
  
  const style = {
    width: width ? `${width}%` : undefined,
    height: height ? `${height}px` : undefined,
  };
  
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className={skeletonClasses}
            style={style}
          />
        ))}
      </div>
    );
  }
  
  return <div className={skeletonClasses} style={style} />;
};

export default Skeleton;
