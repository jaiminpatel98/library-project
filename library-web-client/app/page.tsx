'use client'
import styles from './page.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { getMedia } from './utilities/firebase/functions';
import MediaFilter from './components/media-filter';
import { useEffect, useState } from 'react';
import { Bars } from 'react-loader-spinner';
import Toast from './components/toast';

export default function Home() {
  const [media, setMedia] = useState<Media[]>();
  const [filter, setFilter] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>();
  
  useEffect(() => {
    if (!media) {
      setLoading(true);
      getMedia()
      .then((res) => {
        if (res.length > 0) {
          setMedia(res);
        } else {
          showToast('Warning', `No media retrieved.`, 'warning');
        }
        setLoading(false);
      })
      .catch((error) => {
        showToast('Error', `Failed to retrieve media: ${error.message}`, 'error');
        setLoading(false);
      })
    }
  })

  const showToast = (title: string, message: string, type: string) => {
    setToast({title, message, type});
    setOpen(true);
  }
  
  return (
    <main>
      <div className={styles.filter}>
        {
          media && !loading &&
          <MediaFilter value={filter} setValue={setFilter}/>
        }
      </div>
      <div className={styles.items}>
        {
          media &&
          media.map((media) => {
              if (filter.includes(media.type) || filter.includes('all')) {
                return (
                  <Link 
                    href={`/watch?${media.type === 'video' ? 'v' : media.type === 'image' ? 'i' : 'a'}=${media.fileName}`} 
                    key={media.id} className={styles.item}
                  >
                    <Image width={300} height={200} className={styles.thumbnail}
                      src={media.type === 'video' ? '/video-thumbnail.png' : 
                          media.type === 'audio' ? '/audio-thumbnail.png' : 
                          `https://storage.googleapis.com/library-imgs/${media.fileName}`} alt='Thumbnail'
                    />
                    <p className='FileTitle'>{media.title}</p>
                  </Link>
                )
              }
          })
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
      <Toast open={open} setOpen={setOpen} details={toast}/>
    </main>
  )
}

export const revalidate = 30;