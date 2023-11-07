'use client';
import styles from './page.module.css';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMediaById } from "../utilities/firebase/functions";
import { Bars } from  'react-loader-spinner';

export default function Watch() {
  const [data, setData] = useState<Media>();
  const [loading, setLoading] = useState(false);

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

  const getMedia = async (docId: string) => {
    const data = await getMediaById(docId);
    return data;
  }
  
  return (
    <div className={styles.page}>
      <h1>{data && !loading ? data.title : ''}</h1>
      {
        videoSrc && !loading &&
        <video controls src={videoPrefix + videoSrc}/> 
      }
      {
        audioSrc && !loading &&
        <audio controls src={audioPrefix + audioSrc}/>
      }
      {
        imageSrc && !loading &&
        <img src={imagePrefix + imageSrc} width={1080}/>
      }
      <p>{data && !loading ? data.description : ''}</p>
      {
        loading &&
        <Bars
          height="80"
          width="80"
          color="#222222"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      }
    </div>
  );
}