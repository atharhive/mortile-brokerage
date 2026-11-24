import React from 'react';

interface BrandWordmarkProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  onClick,
  size = 'md',
}) => {
  const textSize =
    size === 'lg'
      ? 'text-[28px]'
      : size === 'sm'
      ? 'text-[19px]'
      : 'text-[23px]';

  const markSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 19;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label="Mortila Brokerage Home"
    >
      {/* Architectural Ventriloc-inspired geometric monogram mark */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 ease-out group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Minimalist structural M-arch with precision ember corner node */}
        <path
          d="M3 19.5V5.5L12 13.5L21 5.5V19.5"
          stroke="#202020"
          strokeWidth="1.9"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <rect
          x="10.25"
          y="16.25"
          width="3.5"
          height="3.5"
          fill="#ff682c"
          className="transition-transform duration-300 origin-center group-hover:rotate-45"
        />
      </svg>

      {/* Whisper-weight lowercase editorial logotype matching Ventriloc's typographic poise */}
      <span
        className={`font-editorial ${textSize} leading-none tracking-[-0.045em] text-graphite inline-flex items-baseline`}
      >
        <span>mortila</span>
        <span className="text-ember-orange ml-[1px] transition-transform duration-200 group-hover:translate-x-[1.5px]">
          .
        </span>
      </span>
    </button>
  );
};
