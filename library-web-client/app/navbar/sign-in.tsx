'use client';

import { Fragment } from 'react';
import styles from './sign-in.module.css';
import { signInWithGoogle, signOut } from '../utilities/firebase/firebase';
import { User } from 'firebase/auth';

interface SignInProps {
  user: User | null;
}

export default function SignIn(props: SignInProps) {

  return (
    <Fragment>
      { props.user ?
        (
          <button className="Button slate" onClick={signOut}>
            Sign Out
          </button>
        ) : (
          <button className="Button slate" onClick={signInWithGoogle}>
            Sign In
          </button>
        )
      }
    </Fragment>
  );  
}