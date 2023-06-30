import AWS from "aws-sdk";
import axios from "axios";
import { toast } from "react-hot-toast";

interface AWSParams {
  Bucket: string;
  Key: string;
  Body: Blob;
  ACL: string;
}

interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export const formatTimeDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)} s`;
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = Math.floor(seconds / 60).toFixed();
    return `${minutes} min`;
  } else {
    const hours = Math.floor(seconds / 3600).toFixed();
    return `${hours} hrs`;
  }
};

export const getAudioDuration = (
  url: string,
  next: (_params: number) => void
) => {
  const audio = new Audio(url);
  audio.addEventListener(
    "durationchange",
    (_) => {
      const duration = audio.duration;
      if (duration !== Infinity) {
        audio.remove();
        next(duration);
      }
    },
    false
  );
  audio.load();
  audio.currentTime = 24 * 60 * 60;
  audio.volume = 0;
  audio.play();
};

export const calculateProgressWidth = (
  duration: number,
  currentTime: number
) => {
  if (duration === 0) {
    return "0%";
  }

  if (duration <= 3) {
    const progress = Math.round((currentTime / duration) * 120);
    return `${progress >= 90 ? 100 : progress}%`;
  }

  const progress = Math.round((currentTime / duration) * 100);
  return `${progress >= 94 ? 100 : progress}%`;
};

export const startMediaRecorder = (
  mediaRecorder: MediaRecorder,
  onDataAvailable: (_event: BlobEvent) => void,
  onStop: () => void
) => {
  mediaRecorder.ondataavailable = onDataAvailable;
  mediaRecorder.onstop = onStop;

  mediaRecorder.start();
  return mediaRecorder;
};

export const uploadAudioToS3 = (s3Config: S3Config, s3Params: AWSParams) => {
  AWS.config.update(s3Config);

  const s3 = new AWS.S3();

  return s3.upload(s3Params).promise();
};

export const uploadAudioUrlToServer = (url: string, conversationId: string) => {
  return axios
    .post("/api/pings", {
      audioUrl: url,
      conversationId: conversationId,
    })
    .catch(() => toast.error("An error occurred, Please try again later"));
};
