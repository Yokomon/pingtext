"use client";

import { User } from "@prisma/client";

import { useRTCHooks } from "./hooks/useRTCHooks";
import { MixedCallerTypes } from "@/types/CallTypes";
import { VideoBox } from "./VideoBox";

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
    endVideoCall,
  } = useRTCHooks(callDetails.id);

  return (
    <div className="p-3 relative h-3/4">
      <VideoBox
        cameraStatus={cameraStatus}
        avatarUser={otherUser}
        video={partnerVideo}
        containerStyle={"relative h-full"}
        avatarContainerStyle={
          "absolute flex rounded-md border dark:border-gray-50/10 border-gray-50 justify-center bg-black items-center w-full h-full"
        }
        className="w-full h-full"
      />

      <div className="w-full flex justify-end">
        <VideoBox
          containerStyle="w-[27rem] h-60 absolute bottom-4 right-6"
          avatarContainerStyle="absolute flex justify-center items-center pb-7 w-full h-full border border-gray-50/10 rounded-md bg-black"
          className="h-full w-full object-cover border border-gray-50/10 rounded-md"
          video={userVideo}
          avatarUser={currentUser}
          avatarHeight={67}
          avatarWidth={67}
          cameraStatus={enableCamera}
          userActions={{
            toggleCamera,
            toggleMic,
            enableCamera,
            enableMic,
          }}
          endVideoCall={endVideoCall}
        />
      </div>
    </div>
  );
};
