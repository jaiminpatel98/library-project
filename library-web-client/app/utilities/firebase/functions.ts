import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getMediaFunction = httpsCallable(functions, 'getMedia');
const setMediaFunction = httpsCallable(functions, 'setMedia');

export async function uploadMedia(file: File, title: string | undefined, description: string | undefined) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop(),
    fileType: file.type.split('/')[0]
  });

  const fileName = response?.data?.fileName
  const mediaId = fileName.split('.')[0];
  const media: Media = {
    id: mediaId,
    uid: mediaId.split('-')[0],
    fileName: fileName,
    status: file.type.split('/')[0] === 'audio' ? 'processed' : 'processing',
    title: title,
    description: description,
    date: Date.now()
  }

  await setMediaFunction({
    mediaId: mediaId,
    media: media
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

export async function getMedia() {
  const response = await getMediaFunction();
  return response.data as Media[];
}