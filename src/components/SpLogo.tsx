import React, { useState } from 'react';

interface SpLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showStudioText?: boolean;
  onDoubleClick?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

const LOGO_SRC_PRIMARY = 'https://lh3.googleusercontent.com/d/12v-iJKurOYVHsajOAV6E5_9BvVce-bP7';
const LOGO_SRC_FALLBACK = 'https://drive.google.com/uc?export=view&id=12v-iJKurOYVHsajOAV6E5_9BvVce-bP7';

export const SpLogo: React.FC<SpLogoProps> = ({
  className = '',
  size = 'md',
  showStudioText = false,
  onDoubleClick,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState(LOGO_SRC_PRIMARY);

  // Determine pixel dimensions
  let dim = 56;

  if (typeof size === 'number') {
    dim = size;
  } else {
    switch (size) {
      case 'sm':
        dim = 36;
        break;
      case 'md':
        dim = 52;
        break;
      case 'lg':
        dim = 92;
        break;
      case 'xl':
        dim = 120;
        break;
    }
  }

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`inline-flex flex-col items-center justify-center select-none cursor-pointer ${className}`}
    >
      <img
        src={imgSrc}
        alt="SP Studio Logo"
        width={dim}
        height={dim}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        className="object-contain drop-shadow-[0_2px_12px_rgba(234,179,8,0.3)] transition-transform duration-300 hover:scale-105"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => {
          if (imgSrc !== LOGO_SRC_FALLBACK) {
            setImgSrc(LOGO_SRC_FALLBACK);
          }
        }}
      />

      {showStudioText && (
        <div
          className="flex items-center gap-1.5 mt-1 tracking-[0.25em] select-none"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-[0.28em]">
            STUDIO
          </span>
        </div>
      )}
    </div>
  );
};
