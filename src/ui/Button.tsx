import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'coral' | 'sky';
  size?: 'normal' | 'large' | 'small';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  fullWidth = true,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#FFD23F] text-[#2B2D42] hover:bg-[#FACC15]',
    secondary: 'bg-white text-[#2B2D42] hover:bg-slate-50',
    mint: 'bg-[#4ADE80] text-[#2B2D42] hover:bg-[#22C55E]',
    coral: 'bg-[#FF6B6B] text-white hover:bg-[#EF4444]',
    sky: 'bg-[#5CC8FF] text-[#2B2D42] hover:bg-[#38BDF8]',
  };

  const sizeStyles = {
    small: 'min-h-[48px] py-2 px-3 text-base',
    normal: 'min-h-[52px] py-3 px-5 text-lg',
    large: 'min-h-[58px] py-3.5 px-6 text-xl',
  };

  return (
    <button
      disabled={disabled}
      className={`sticker-button flex items-center justify-center gap-2 select-none font-bold text-center cursor-pointer transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[0_4px_0_rgba(43,45,66,0.15)] focus-visible:ring-3 focus-visible:ring-[#2B2D42] focus-visible:outline-none ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
