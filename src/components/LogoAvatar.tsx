import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui-shadcn/Avatar';

import React from 'react';

export default function LogoAvatar({
  src,
  alt,
  className,
  fallbackIcon,
}: {
  className?: string;
  alt: string;
  src: string;
  fallbackIcon: React.ReactNode;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallbackIcon}</AvatarFallback>
    </Avatar>
  );
}
