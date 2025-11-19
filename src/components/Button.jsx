import React from 'react';


const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:hover:bg-emerald-600',
    secondary: 'border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:hover:bg-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 disabled:hover:bg-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 disabled:hover:bg-green-600',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 disabled:hover:bg-orange-600',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 disabled:hover:bg-white',
    ghost: 'text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 22 : 20} />}
      {children}
    </button>
  );
};

export default Button;