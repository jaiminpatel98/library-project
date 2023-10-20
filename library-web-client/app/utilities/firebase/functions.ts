import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const setVideoFunction = httpsCallable(functions, 'setVideo');

export interface Video {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  date?: number
}

export async function uploadVideo(file: File, title: string | undefined, description: string | undefined) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop()
  });

  const fileName = response?.data?.fileName
  const videoId = fileName.split('.')[0];
  const video = {
    id: videoId,
    uid: videoId.split('-')[0],
    fileName: fileName,
    status: "processing",
    title: title,
    description: description,
    date: Date.now()
  }

  await setVideoFunction({
    videoId: videoId,
    video: video as Video
  })

  const uploadResult = await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  return uploadResult;
}

export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[];
}