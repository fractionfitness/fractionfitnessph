import Image from 'next/image';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.devs}>
        <li>
          <Image
            src="/octocat-avatar.png"
            width={45}
            height={45}
            alt="FFPH Logo"
          />
          <span>El Gato con Botas</span>
        </li>
      </ul>
    </footer>
  );
}
