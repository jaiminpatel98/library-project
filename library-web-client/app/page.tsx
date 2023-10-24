import styles from './page.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { getVideos } from './utilities/firebase/functions';

export default async function Home() {
  const videos = await getVideos();
  console.log(videos);
  return (
    <main>
      <div className={styles.items}>
      {
        videos.map((video) => (
            <Link href={`/watch?v=${video.fileName}`} key={video.id} className={styles.item}>
              <Image width={240} height={160} className={styles.thumbnail}
                src={'/thumbnail.png'} alt='Play Button Thumbnail'/>
              <p className='FileTitle'>{video.title}</p>
            </Link>
        ))
      }
      </div>
    </main>
  )
}

export const revalidate = 30;