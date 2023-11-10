'use client'

import Image from 'next/image';
import styles from './navbar.module.css';
import Link from 'next/link';
import SignIn from './sign-in';
import UploadForm from '../upload-form/upload-form';
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
  });

  return (
    <nav className={styles.nav}>
      <Link href='/' className={styles.logoContainer}>
        <svg xmlns="http://www.w3.org/2000/svg" width={90} height={81} fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </Link>
      <div className={styles.right}>
        {
          user && <UploadForm />
        }
        <SignIn user={user}/>
      </div>
    </nav>
  );
}