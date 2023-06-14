import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export default function UserAvatar({ src, alt }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
