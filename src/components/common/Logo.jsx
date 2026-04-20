import React from 'react';
import { Road } from 'lucide-react';

const Logo = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl"
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className={`${sizeClasses[size]} bg-brand-orange rounded-full flex items-center justify-center text-white shadow-lg ${className}`}>
      <Road size={iconSizes[size]} strokeWidth={2.5} />
    </div>
  );
};

export default Logo;
