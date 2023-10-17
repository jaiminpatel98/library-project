import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

const storage = new Storage();

const rawVideoBucketName = 'library-raw-videos';
const processedVideoBucketName = 'library-processed-videos';

const localRawVideoPath = './raw-videos';
const localProcessedVideoPath = './processed-videos';

/**
 * Initialize directories for video files
 */
export function setupDirectories() {
  verifyDirectoryExistence(localRawVideoPath);
  verifyDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - Name of raw video file converted from {@link localRawVideoPath}
 * @param processedVideoName - Name of processed video file converted to {@link localProcessedVideoPatha}
 * @returns Promise that resolves at the end of the conversion process
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions('-vf', 'scale=-1:360')
      .on('end', () => {
        console.log('Video processed successfully.')
        resolve();
      })
      .on('error', (error: any) => {
        console.log(`Error: ${error.message}`);
        reject(error);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  })
}
/**
 * @param fileName - The name of the file to download from {@link rawVideoBucketName}
 * @returns Promise that resolved once the video is successfully downloaded
 */
export async function downloadRawVideo(fileName: string) {
  await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`)
}

/**
 * @param fileName - Name of the file to be uploaded
 * from {@link localProcessedVideoPath} to {@link processedVideoBucketName}
 * @return Promise that resolves when the file has been uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName
  })

  console.log(`gs://${localProcessedVideoPath}/${fileName} uploaded to ${processedVideoBucketName}/${fileName}.`)

  await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - Name of the file we want to delete from {@link localRawVideoPath}
 * @returns Promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - Name of the file we want to delete from {@link localProcessedVideoPath}
 * @returns Promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - Path of file to delete
 * @returns Promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log(`Failed to delete file at ${filePath}`, error);
          reject(error);
        } else {
          console.log(`File deleted at ${filePath}.`);
          resolve();
        }
      })
    } else {
      console.log(`File not found at ${filePath}.`);
      resolve();
    }
  })
}

/**
 * @param dirPath - Path of directory to verify 
 */
function verifyDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables nested directory creation
    console.log(`Directory created at ${dirPath}`);
  }
}