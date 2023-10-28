'use client';
import { useSearchParams } from "next/navigation";

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/library-processed-videos/';
  const audioPrefix = 'https://storage.googleapis.com/library-audios/';
  const videoSrc = useSearchParams().get('v');
  const audioSrc = useSearchParams().get('a');
  
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
    </div>
  );
}