'use client';
import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUser } from "../utilities/firebase/functions";
import { Bars } from  'react-loader-spinner';

export default function User() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const uid = useSearchParams().get('u');

  useEffect(() => {
    if (uid && !user) {
      setLoading(true);
      getUser(uid)
      .then((res) => {
        if (res) {
          setUser(res);
          setLoading(false);
        }
        console.log(res)
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
      })
    }
  })

  return (
    <div className={styles.page}>
      {
        !loading &&
        <div>
          <h1>{user ? user.name : ''}</h1>
          {
            user?.photoUrl &&
            <img src={user.photoUrl} height={360}/>
          }
          <p>{user ? user.bio : ''}</p>
          <a href="https://open.spotify.com/artist/2PvuSMyBJ31yIdjkhsrEN7?si=FM1hT_hISpC19hfZCLu8xw">{user?.email === 'jaiminpatel98@gmail.com' ? 'Hillside Garden' : ''}</a>
        </div>
      }
      {
        loading &&
        <div className={styles.loading}>
          <Bars
          height="80"
          width="80"
          color="#222222"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          />
        </div>
      }
    </div>
  );
}