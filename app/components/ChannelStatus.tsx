"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { MdCall } from "@react-icons/all-files/md/MdCall";
import { MdCallEnd } from "@react-icons/all-files/md/MdCallEnd";
import { User } from "@prisma/client";

import { usePusher } from "../context/PusherContext";
import { NewCall } from "@/types/CallTypes";
import { useChannel } from "../hooks/useChannel";
import { callingSound } from "../utils/sounds";

interface IChannelStatus {
  currentUser: User | null;
}

export const ChannelStatus: React.FC<IChannelStatus> = ({ currentUser }) => {
  useChannel();

  const pusherClient = usePusher();
  const router = useRouter();

  const handleAcceptCall = (callId: string, toastId: string) => {
    router.push(`/calls/${callId}`);
    toast.dismiss(toastId);
  };

  const getCustomToast = ({
    name,
    callId,
  }: {
    name: string;
    callId: string;
  }) => {
    const incomingCall = callingSound();

    incomingCall.play();
    return toast.custom(
      (t) => (
        <div
          className={clsx({
            ["w-72 h-24 p-3 px-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-50/20"]:
              true,
            ["ease-in duration-300"]: t.visible,
          })}
        >
          <h4 className="text-sm">{`${name} is calling...`}</h4>
          <div className="flex items-center justify-between mt-3">
            <div
              className="rounded-full bg-green-600 p-2 dark:animate-pulse duration-500 cursor-pointer"
              onClick={() => {
                incomingCall.stop();
                handleAcceptCall(callId, t.id);
              }}
            >
              <MdCall size={20} className="text-white" />
            </div>
            <div className="rounded-full bg-rose-500 p-2 dark:animate-pulse duration-300 cursor-pointer">
              <MdCallEnd
                size={20}
                className="text-white"
                onClick={() => {
                  incomingCall.stop();
                  toast.dismiss(t.id);
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        duration: 12e4,
      }
    );
  };

  useEffect(() => {
    pusherClient.subscribe("calls");

    const handleNewCall = ({ userId, name, callId }: NewCall) => {
      if (currentUser) {
        if (currentUser.id === userId) {
          getCustomToast({ name, callId });
        }
      } else {
        return null;
      }
    };

    pusherClient.bind("calls:new", handleNewCall);

    return () => {
      pusherClient.unsubscribe("calls");
      pusherClient.unbind("calls:new", handleNewCall);
    };
  }, [pusherClient, currentUser]);

  return null;
};
