import styles from './page.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { getMedia } from './utilities/firebase/functions';

export default async function Home() {
  const media = await getMedia();
  console.log(media);
  return (
    <main>
      <div className={styles.items}>
      {
        media.map((media) => (
            <Link 
              href={`/watch?${media.type === 'video' ? 'v' : media.type === 'image' ? 'i' : 'a'}=${media.fileName}`} 
              key={media.id} className={styles.item}
            >
              <Image width={240} height={160} className={styles.thumbnail}
                src={media.type === 'video' ? '/video-thumbnail.png' : 
                    media.type === 'audio' ? '/audio-thumbnail.png' : 
                    `https://storage.googleapis.com/library-imgs/${media.fileName}`} alt='Thumbnail'
              />
              <p className='FileTitle'>{media.title}</p>
            </Link>
        ))
      }
      </div>
    </main>
  )
}

export const revalidate = 30;