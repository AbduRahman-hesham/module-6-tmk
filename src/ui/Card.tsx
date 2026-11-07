import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'sun' | 'mint' | 'coral' | 'sky' | 'grape' | 'cream';
  className?: string;
  shake?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  className = '',
  shake = false,
  ...props
}) => {
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    sun: 'bg-[#FFD23F]',
    mint: 'bg-[#4ADE80]',
    coral: 'bg-[#FF6B6B]',
    sky: 'bg-[#5CC8FF]',
    grape: 'bg-[#8B5CF6] text-white',
    cream: 'bg-[#FFF7E6]',
  };

  return (
    <div
      className={`rounded-[20px] border-[3px] border-[#2B2D42] shadow-[0_4px_0_rgba(43,45,66,0.25)] p-4 transition-all duration-150 ${
        bgClasses[variant] || 'bg-white'
      } ${shake ? 'shake-wrong' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
