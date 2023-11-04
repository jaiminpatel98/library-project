'use client';
import { useSearchParams } from "next/navigation";

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/library-processed-videos/';
  const audioPrefix = 'https://storage.googleapis.com/library-audios/';
  const imagePrefix = 'https://storage.googleapis.com/library-imgs/';
  const videoSrc = useSearchParams().get('v');
  const audioSrc = useSearchParams().get('a');
  const imageSrc = useSearchParams().get('i');
  
  return (
    <div>
      <h1>Watch Page</h1>
      {
        videoSrc &&
        <video controls src={videoPrefix + videoSrc}/> 
      }
      {
        audioSrc &&
        <audio controls src={audioPrefix + audioSrc}/>
      }
      {
        imageSrc &&
        <img src={imagePrefix + imageSrc} width={1080}/>
      }
    </div>
  );
}