// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useNavigateTo } from '../navigationHook'; 
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const navigateTo = useNavigateTo();

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a
            onClick={() => navigateTo('/')}
            className={pathname === '/' ? styles.navLinkActive : styles.link}
          >
            Home
          </a>
        </li>
        <li className={styles.navItem}>
          <a
            onClick={() => navigateTo('/about')}
            className={pathname === '/about' ? styles.navLinkActive : styles.navLink}
          >
            About Me
          </a>
        </li>
        <li className={styles.navItem}>
          <a
            onClick={() => navigateTo('/contact')}
            className={pathname === '/contact' ? styles.navLinkActive : styles.navLink}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
