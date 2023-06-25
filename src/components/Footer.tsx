// import Image from 'next/image';

// import { cn } from '@/lib/utils';
import styles from './Footer.module.css';
import LogoAvatar from './LogoAvatar';
import { Icons } from './Icons';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-700  text-zinc-700">
      <ul className={styles.devs}>
        <li className="items-center space-x-2 flex">
          {/* <Image
            src="/octocat-avatar.png"
            width={45}
            height={45}
            alt="FFPH Logo"
          /> */}
          <span className="font-normal">Developed by:</span>
          <LogoAvatar
            src="/octocat-avatar.png"
            alt="@elgato"
            className="w-7 h-7 bg-zinc-700"
            fallbackIcon={<Icons.user className="w-7 h-7" />}
          />
          <span className="font-normal">El Gato con Botas</span>
        </li>
      </ul>
    </footer>
  );
}
