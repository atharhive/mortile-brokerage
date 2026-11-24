import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  showArrow?: boolean;
  children: React.ReactNode;
}

export const EditorialButton: React.FC<EditorialButtonProps> = ({
  variant = 'primary',
  showArrow = false,
  className = '',
  children,
  ...props
}) => {
  const base = variant === 'primary' ? 'btn-graphite' : 'btn-ghost-graphite';

  return (
    <button
      {...props}
      className={`group inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 ${base} ${className}`}
    >
      <span className="btn-roll-track">
        <span className="btn-roll-item">
          <span>{children}</span>
          {showArrow && (
            <ArrowRight
              className="w-4 h-4 shrink-0 transition-transform duration-200"
              strokeWidth={1.5}
            />
          )}
        </span>
        <span className="btn-roll-item" aria-hidden="true">
          <span>{children}</span>
          {showArrow && (
            <ArrowRight
              className="w-4 h-4 shrink-0 translate-x-0.5"
              strokeWidth={1.5}
            />
          )}
        </span>
      </span>
    </button>
  );
};
