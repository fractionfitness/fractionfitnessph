import Image from 'next/image';

import styles from './Footer.module.css';
import UserAvatar from './UserAvatar';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.devs}>
        <li>
          {/* <Image
            src="/octocat-avatar.png"
            width={45}
            height={45}
            alt="FFPH Logo"
          /> */}
          <UserAvatar src="/octocat-avatar.png" alt="@elgato" />
          <span>El Gato con Botas</span>
        </li>
      </ul>
    </footer>
  );
}
