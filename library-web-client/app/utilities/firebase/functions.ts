import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos')

export interface Video {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  date?: string
}

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop()
  });

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