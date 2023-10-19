import styles from './page.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { getVideos } from './utilities/firebase/functions';

export default async function Home() {
  const videos = await getVideos();
  console.log(videos);
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.fileName}`} key={video.id}>
            <Image width={240} height={160} className={styles.thumbnail}
              src={'/thumbnail.png'} alt='Play Button Thumbnail'/>
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 30;