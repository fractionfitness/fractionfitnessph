import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui-shadcn/Avatar';

export default function UserAvatar({ src, alt }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
