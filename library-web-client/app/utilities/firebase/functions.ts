import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getMediaFunction = httpsCallable(functions, 'getMedia');
const getMediaByIdFunction = httpsCallable(functions, 'getMediaById');
const getUserFunction = httpsCallable(functions, 'getUser');
const setMediaFunction = httpsCallable(functions, 'setMedia');

export async function getMedia() {
  const response = await getMediaFunction();
  return response.data as Media[];
}

export async function getMediaById(docId: string) {
  const response = await getMediaByIdFunction({docId: docId});
  return response.data as Media;
}

export async function getUser(docId: string) {
  const response = await getUserFunction({docId: docId});
  return response.data as User;
}

export async function uploadMedia(file: File, title: string | undefined, description: string | undefined) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop(),
    fileType: file.type.split('/')[0]
  });

  const fileType = file.type.split('/')[0];
  const fileName = response?.data?.fileName;
  const mediaId = fileName.split('.')[0];
  const media: Media = {
    id: mediaId,
    uid: mediaId.split('-')[0],
    fileName: fileName,
    status: fileType === 'video' ? 'processing' : 'processed',
    title: title,
    description: description,
    type: fileType,
    date: Date.now()
  }

  //TODO: add error handling
  const headerConfig = {
    'Content-Type': file.type,
    'x-goog-acl': fileType !== 'video' ? 'public-read' : 'private'
  }
  const uploadResult = await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: headerConfig
  });

  await setMediaFunction({
    mediaId: mediaId,
    media: media
  });

  return uploadResult;
}