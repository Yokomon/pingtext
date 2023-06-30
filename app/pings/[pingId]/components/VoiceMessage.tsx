"use client";

import React, { useRef, useState } from "react";
import { FaMicrophone } from "@react-icons/all-files/fa/FaMicrophone";
import { HiPause } from "@react-icons/all-files/hi/HiPause";
import { BsPlayFill } from "@react-icons/all-files/bs/BsPlayFill";
import {
  calculateProgressWidth,
  formatTimeDuration,
  getAudioDuration,
} from "./utils";

interface VoiceMessageProps {
  url: string;
  pingList?: boolean;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({
  url,
  pingList,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playStatus, setPlayStatus] = useState(true);

  const handleAudioMetadata = () => {
    if (audioRef.current) {
      getAudioDuration(url, (duration) => {
        setDuration(duration);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <>
      <div className="flex space-x-2 items-center w-full">
        {pingList && (
          <div className="flex items-center space-x-3 mr-14 my-2">
            <FaMicrophone size={18} />
            <p>Voice message</p>
          </div>
        )}
      </div>
      <audio
        controls
        ref={audioRef}
        onLoadedMetadata={handleAudioMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlayStatus(true)}
        className="hidden"
      >
        <source type="audio/webm" src={url} />
      </audio>

      {!pingList && audioRef.current && (
        <>
          <div className="w-64 flex space-x-2 items-center h-6 mt-3 mb-0">
            {playStatus ? (
              <BsPlayFill
                size={33}
                className="cursor-pointer"
                onClick={() => {
                  setPlayStatus(!playStatus);
                  audioRef.current?.play();
                }}
              />
            ) : (
              <HiPause
                size={33}
                className="cursor-pointer"
                onClick={() => {
                  setPlayStatus(!playStatus);
                  audioRef.current?.pause();
                }}
              />
            )}

            <div className="w-full rounded-full h-2.5 bg-gray-100">
              <div
                className="bg-sky-500 h-2.5 duration-300 ease-linear rounded-full"
                style={{ width: calculateProgressWidth(duration, currentTime) }}
              />
            </div>
          </div>
          <p className="text-xs leading-4 tracking-wider text-right">
            {formatTimeDuration(duration)}
          </p>
        </>
      )}
    </>
  );
};
