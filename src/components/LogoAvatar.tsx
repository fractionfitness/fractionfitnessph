import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui-shadcn/Avatar';

export default function UserAvatar({
  src,
  alt,
  className,
}: {
  className?: string;
  alt: string;
  src: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
