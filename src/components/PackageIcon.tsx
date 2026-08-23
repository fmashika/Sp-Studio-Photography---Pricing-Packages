import React from 'react';
import {
  Star,
  Shield,
  Camera,
  Video,
  Crown,
  Sparkles,
  Heart,
  Gem,
  Flame,
  Award,
  Film,
  Tv,
  Aperture,
  Music,
  LucideProps,
} from 'lucide-react';
import { IconStyleType } from '../types';

interface PackageIconProps extends LucideProps {
  iconType?: IconStyleType | string;
}

export const PackageIcon: React.FC<PackageIconProps> = ({ iconType, className = 'w-5 h-5', ...props }) => {
  if (!iconType || iconType === 'none') {
    return null;
  }

  switch (iconType) {
    case 'star':
      return <Star className={className} {...props} />;
    case 'shield':
      return <Shield className={className} {...props} />;
    case 'camera':
      return <Camera className={className} {...props} />;
    case 'video':
      return <Video className={className} {...props} />;
    case 'crown':
      return <Crown className={className} {...props} />;
    case 'sparkles':
      return <Sparkles className={className} {...props} />;
    case 'heart':
      return <Heart className={className} {...props} />;
    case 'flame':
      return <Flame className={className} {...props} />;
    case 'gem':
      return <Gem className={className} {...props} />;
    case 'award':
      return <Award className={className} {...props} />;
    case 'film':
      return <Film className={className} {...props} />;
    case 'tv':
      return <Tv className={className} {...props} />;
    case 'aperture':
      return <Aperture className={className} {...props} />;
    case 'music':
      return <Music className={className} {...props} />;
    default:
      return <Star className={className} {...props} />;
  }
};
