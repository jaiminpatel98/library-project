'use client'

import Image from 'next/image';
import styles from './navbar.module.css';
import Link from 'next/link';
import SignIn from './sign-in';
import { onAuthStateChangedHelper } from '../utilities/firebase/firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function Navbar() {
  //
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    })

    // Cleanup subscription on unmount
    return () => unsubscribe();
  })

  return (
    <nav className={styles.nav}>
      <Link href='/'>
        <Image width={231} height={90}
          src='/lib-logo.svg' alt='Library Logo'/>
      </Link>
      <SignIn user={user}/>
    </nav>
  );
}