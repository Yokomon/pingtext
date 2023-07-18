"use client";

import clsx from "clsx";
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";
import { BsCameraVideoOffFill } from "@react-icons/all-files/bs/BsCameraVideoOffFill";
import { PiMicrophoneFill } from "@react-icons/all-files/pi/PiMicrophoneFill";
import { PiMicrophoneSlashFill } from "@react-icons/all-files/pi/PiMicrophoneSlashFill";

import { useRTCHooks } from "./hooks/useRTCHooks";
import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { MixedCallerTypes } from "@/types/CallTypes";
import { RefObject } from "react";

interface VideoCallProps {
  callDetails: MixedCallerTypes;
  currentUser: User;
  otherUser: User;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  callDetails,
  currentUser,
  otherUser,
}) => {
  const {
    userVideo,
    otherUserVideo,
    toggleCamera,
    toggleMic,
    enableCamera,
    enableMic,
  } = useRTCHooks(callDetails.id);

  return (
    <div className="p-3 relative">
      <div className="relative">
        <div
          className={clsx({
            ["absolute flex justify-center items-center w-full h-full"]: true,
            ["hidden"]: enableCamera,
          })}
        >
          <Avatar
            currentUser={currentUser}
            removeBadge
            imageHeight={130}
            imageWidth={130}
          />
        </div>
        <video
          autoPlay
          ref={userVideo}
          className="w-full h-full border rounded-md bg-rose-500"
          muted
        />
        <div
          onClick={toggleCamera}
          className={clsx({
            ["p-4 w-fit duration-500 absolute bottom-0 right-1/2 rounded-full my-5 cursor-pointer"]:
              true,
            [" bg-rose-50 hover:bg-rose-100"]: enableCamera,
            ["bg-gray-50 hover:bg-gray-100"]: !enableCamera,
          })}
        >
          {enableCamera ? (
            <BsCameraVideoFill size={32} className="fill-rose-500" />
          ) : (
            <BsCameraVideoOffFill size={32} className="fill-gray-400" />
          )}
        </div>
        <div
          onClick={toggleMic}
          className={clsx({
            ["p-3 w-fit duration-500 absolute bottom-0 right-[42%] rounded-full my-5 cursor-pointer"]:
              true,
            [" bg-rose-50 hover:bg-rose-100"]: enableMic,
            ["bg-gray-50 hover:bg-gray-100"]: !enableMic,
          })}
        >
          {enableMic ? (
            <PiMicrophoneFill size={28} className="fill-rose-500" />
          ) : (
            <PiMicrophoneSlashFill size={28} className="fill-gray-400" />
          )}
        </div>
      </div>

      <div className="w-full flex justify-end -mb-10">
        <div className="w-60 h-48 absolute bottom-0 right-6">
          <div
            className={clsx({
              ["absolute flex justify-center items-center w-full h-full"]: true,
              ["hidden"]: true,
            })}
          >
            <Avatar
              currentUser={otherUser}
              removeBadge
              imageHeight={50}
              imageWidth={50}
            />
          </div>
          <video
            autoPlay
            ref={otherUserVideo as RefObject<HTMLVideoElement>}
            className={clsx({
              ["border-2 border-gray-300 rounded-md h-full bg-black"]: true,
            })}
          />
        </div>
      </div>
    </div>
  );
};
