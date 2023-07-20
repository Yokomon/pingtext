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
    partnerVideo,
    toggleCamera,
    toggleMic,
    enableCamera,
    enableMic,
    cameraStatus,
  } = useRTCHooks(callDetails.id);

  return (
    <div className="p-3 relative h-full">
      <div className="relative h-full">
        <div
          className={clsx({
            ["absolute flex justify-center items-center w-full h-full"]: true,
            ["hidden"]: cameraStatus,
          })}
        >
          <Avatar
            currentUser={otherUser}
            removeBadge
            imageHeight={130}
            imageWidth={130}
          />
        </div>
        <video
          autoPlay
          ref={partnerVideo}
          className="w-full h-full border rounded-md"
        />
      </div>

      <div className="w-full flex justify-end">
        <div className="w-[27rem] h-60 absolute bottom-4 right-6">
          <div
            className={clsx({
              ["absolute flex justify-center items-center pb-7 w-full h-full"]:
                true,
              ["hidden"]: enableCamera,
            })}
          >
            <Avatar
              currentUser={currentUser}
              removeBadge
              imageHeight={67}
              imageWidth={67}
            />
          </div>
          <video
            ref={userVideo}
            autoPlay
            muted
            className={clsx({
              ["border-2 border-gray-300 rounded-md object-cover h-full w-full bg-black"]:
                true,
            })}
          />
          <div className="absolute bottom-0 flex items-center justify-center w-full space-x-3">
            <div
              onClick={toggleCamera}
              className={clsx({
                ["p-4 w-fit duration-500 rounded-full my-5 cursor-pointer"]:
                  true,
                [" bg-rose-50 hover:bg-rose-100"]: enableCamera,
                ["bg-gray-50 hover:bg-gray-100"]: !enableCamera,
              })}
            >
              {enableCamera ? (
                <BsCameraVideoFill size={14} className="fill-rose-500" />
              ) : (
                <BsCameraVideoOffFill size={14} className="fill-gray-400" />
              )}
            </div>
            <div
              onClick={toggleMic}
              className={clsx({
                ["p-3 w-fit duration-500 rounded-full my-5 cursor-pointer"]:
                  true,
                [" bg-rose-50 hover:bg-rose-100"]: enableMic,
                ["bg-gray-50 hover:bg-gray-100"]: !enableMic,
              })}
            >
              {enableMic ? (
                <PiMicrophoneFill size={14} className="fill-rose-500" />
              ) : (
                <PiMicrophoneSlashFill size={14} className="fill-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
