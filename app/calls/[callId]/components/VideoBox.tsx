"use client";

import clsx from "clsx";
import { RefObject } from "react";
import { User } from "@prisma/client";
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";
import { BsCameraVideoOffFill } from "@react-icons/all-files/bs/BsCameraVideoOffFill";
import { PiMicrophoneFill } from "@react-icons/all-files/pi/PiMicrophoneFill";
import { PiMicrophoneSlashFill } from "@react-icons/all-files/pi/PiMicrophoneSlashFill";
import { MdCallEnd } from "@react-icons/all-files/md/MdCallEnd";

import { Avatar } from "@/app/components/Avatar";

interface IVideoBox {
  cameraStatus: boolean;
  avatarUser: User;
  video: RefObject<HTMLVideoElement>;
  avatarHeight?: number;
  avatarWidth?: number;
  containerStyle: string;
  avatarContainerStyle: string;
  className: string;
  userActions?: {
    toggleCamera: () => void;
    toggleMic: () => void;
    enableMic: boolean;
    enableCamera: boolean;
  };
  endVideoCall?: () => void;
}

const getActionStyles = (action: boolean) =>
  clsx({
    ["p-3 w-fit duration-500 group-hover:opacity-100 opacity-0 rounded-full my-5 cursor-pointer"]:
      true,
    ["bg-rose-50 hover:bg-rose-200"]: action,
    ["bg-gray-50 hover:bg-gray-200"]: !action,
  });

export const VideoBox: React.FC<IVideoBox> = ({
  cameraStatus,
  avatarUser,
  video,
  containerStyle,
  avatarContainerStyle,
  avatarHeight,
  avatarWidth,
  userActions,
  endVideoCall,
  ...props
}) => {
  return (
    <div className={containerStyle}>
      <div
        className={clsx({
          [avatarContainerStyle]: true,
          ["hidden"]: cameraStatus,
        })}
      >
        <Avatar
          currentUser={avatarUser}
          removeBadge
          imageHeight={avatarHeight ?? 130}
          imageWidth={avatarWidth ?? 130}
        />
      </div>
      <video autoPlay ref={video} {...props} />
      {userActions ? (
        <div className="absolute group bottom-0 flex items-center justify-center w-full space-x-4">
          <div
            onClick={userActions.toggleCamera}
            className={getActionStyles(userActions.enableCamera)}
          >
            {userActions.enableCamera ? (
              <BsCameraVideoFill size={13} className="fill-rose-500" />
            ) : (
              <BsCameraVideoOffFill size={13} className="fill-gray-400" />
            )}
          </div>
          <div
            onClick={endVideoCall}
            className="w-fit cursor-pointer duration-500 group-hover:opacity-100 opacity-0 bg-rose-500 hover:bg-rose-600 rounded-full p-4"
          >
            <MdCallEnd size={20} className="fill-white" />
          </div>
          <div
            onClick={userActions.toggleMic}
            className={getActionStyles(userActions.enableMic)}
          >
            {userActions.enableMic ? (
              <PiMicrophoneFill size={13} className="fill-rose-500" />
            ) : (
              <PiMicrophoneSlashFill size={13} className="fill-gray-400" />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
