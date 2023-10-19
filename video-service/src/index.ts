import express from 'express';
import { 
  convertVideo, 
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo
} from './gcStorage';
import { isVideoNew, setVideo } from './firestore';

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

setupDirectories();

const app = express();
app.use(express.json());

app.post('/process-video', async (req, res) => {
  // Get the bukcet and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad request: missing fileName.');
  }

  const inFileName = data.name;
  const outFileName = `processed-${inFileName}`;
  const videoId = inFileName.split('.')[0];

  if (!isVideoNew(videoId)) {
    return res.status(400).send('Bad Request: Video already entered processing');
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing',
    });
  }

  // Download raw video from CS
  await downloadRawVideo(inFileName);

  try {
    await convertVideo(inFileName, outFileName);
  } catch(error) {
    await Promise.all([
      deleteRawVideo(inFileName),
      deleteProcessedVideo(outFileName)
    ])
    console.log(error)
    return res.status(500).send('Internal Server error: Video conversion processing failed.')
  }

  // Upload the processed video to CS
  await uploadProcessedVideo(outFileName);

  await setVideo(videoId, {
    status: 'processed',
    fileName: outFileName
  });

  await Promise.all([
    deleteRawVideo(inFileName),
    deleteProcessedVideo(outFileName)
  ])

  return res.status(200).send('Video conversion processsing finished successfully.')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video service listening at http://localhost:${port}`)
});