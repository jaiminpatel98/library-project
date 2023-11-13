'use client';
import styles from './page.module.css';
import * as Avatar from '@radix-ui/react-avatar';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMediaById } from "../utilities/firebase/functions";
import { getUser } from "../utilities/firebase/functions";
import { Bars } from  'react-loader-spinner';
import Link from 'next/link';
import Toast from '../components/toast';

export default function Watch() {
  const [data, setData] = useState<Media>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>();

  const videoPrefix = 'https://storage.googleapis.com/library-processed-videos/';
  const audioPrefix = 'https://storage.googleapis.com/library-audios/';
  const imagePrefix = 'https://storage.googleapis.com/library-imgs/';
  const videoSrc = useSearchParams().get('v');
  const audioSrc = useSearchParams().get('a');
  const imageSrc = useSearchParams().get('i');
  const docId = videoSrc ? videoSrc.split('.')[0].split('-').slice(1,3).join('-') :
                audioSrc ? audioSrc.split('.')[0] :
                imageSrc ? imageSrc.split('.')[0] : null;
                
  useEffect(() => {
    if (docId && !data) {
      setLoading(true);
      getMedia(docId)
      .then((res) => {
        if (res) {
          setData(res);
          if (res.uid) {
            getUserHelper(res?.uid)
            .then((usr) => {
              if (usr) {
                setUser(usr);
              }
            })
            .catch((error) => {
              setLoading(false);
              showToast('Error', `Failed to retrieve user: ${error.message}`, 'error');
            })
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        showToast('Error', `Failed to retrieve media: ${error.message}`, 'error');
      })
    }
  })

  const getMedia = async (docId: string) => {
    const data = await getMediaById(docId);
    return data;
  }

  const getUserHelper = async (docId: string) => {
    const data = await getUser(docId);
    return data;
  }

  const showToast = (title: string, message: string, type: string) => {
    setToast({title, message, type});
    setOpen(true);
  }
  
  return (
    <div className={styles.page}>
      {
        !loading &&
        <div>
          <h1>{data ? data.title : ''}</h1>
          <p>{data ? data.date ? 'Created: ' + new Date(data.date).toLocaleString().split(',')[0] : '' : ''}</p>
          {
            videoSrc &&
            <video controls src={videoPrefix + videoSrc} height={615}/> 
          }
          {
            audioSrc &&
            <audio controls src={audioPrefix + audioSrc} />
          }
          {
            imageSrc &&
            <img src={imagePrefix + imageSrc} height={615}/>
          }
          <div className={styles.profile}>
            <div>
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image 
                  className="AvatarImage"
                  src={user?.photoUrl}
                  alt={user?.name + 'profile image'}
                />
                <Avatar.Fallback className="AvatarFallback">
                  {user?.name?.split(' ')[0][0]}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
            <div className={styles.nameContainer}>
              <Link className={styles.name} href={`/user?u=${user?.uid}`} key={user?.uid}>
                <p className="FileTitle">{user?.name}</p>
              </Link>
            </div>
          </div>
          <p>{data ? data.description : ''}</p>
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
      <Toast open={open} setOpen={setOpen} details={toast}/>
    </div>
  );
}