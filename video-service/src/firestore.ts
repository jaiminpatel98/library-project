import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

const mediaCollectionId = 'media';

export interface Video {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  date?: string
}

/**
 * @param videoId - Id of Video document to be fetched
 * @returns Video document data OR empty object
 */
async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(mediaCollectionId).doc(videoId).get();
  return ((snapshot.data() as Video) ?? {});
}

/**
 * @param videoId - Id of Video document to be written to
 * @param video - Video interface metadata to be written to a document
 * @returns Promise that resolves when video document is updated
 */
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(mediaCollectionId)
    .doc(videoId)
    .set(video, { merge: true })
}

/**
 * @param videoId - Id of Video document to be checked
 * @returns True if video does not exist yet, otherwise False
 */
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}