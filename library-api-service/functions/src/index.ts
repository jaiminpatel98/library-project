import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = "library-raw-videos";
const audioBucketName = "library-audios";
const imageBucketName = "library-imgs";
const mediaCollectionId = "media";

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);

  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Function must be called while user is authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(
    data.fileType === "video" ? rawVideoBucketName :
      data.fileType === "audio" ? audioBucketName : imageBucketName
  );

  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
    extensionHeaders: {
      "x-goog-acl": data.fileType !== "video" ? "public-read" : "private",
    },
  });

  return {url, fileName};
});

export const getMedia = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(mediaCollectionId).limit(100).get();
  return querySnapshot.docs.map((doc) => doc.data());
});

export const getMediaById = onCall({maxInstances: 1}, async (request) => {
  const data = request.data;
  const snap = await firestore
    .collection(mediaCollectionId)
    .doc(data.docId)
    .get();
  const serialized = JSON.parse(JSON.stringify(snap.data()));
  return serialized;
});

export const setMedia = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Function must be called while user is authenticated."
    );
  }
  const data = request.data;
  return firestore
    .collection(mediaCollectionId)
    .doc(data.mediaId)
    .set(data.media, {merge: true});
});
