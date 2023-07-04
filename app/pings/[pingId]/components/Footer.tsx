"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RiSendPlaneFill } from "@react-icons/all-files/ri/RiSendPlaneFill";
import { GrEmoji } from "@react-icons/all-files/gr/GrEmoji";
import { FaMicrophone } from "@react-icons/all-files/fa/FaMicrophone";
import { FaStop } from "@react-icons/all-files/fa/FaStop";
import { randomBytes } from "crypto";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { PingInput } from "./PingInput";
import { FullConversationType } from "@/types/ConversationTypes";
import { encryptMessage } from "@/app/utils/encryption";
import useDetectClickOutside from "@/app/hooks/useDetectClickOutside";
import {
  startMediaRecorder,
  uploadAudioToS3,
  uploadAudioUrlToServer,
} from "./utils";

interface FooterProps {
  conversation: FullConversationType;
}

export const Footer: React.FC<FooterProps> = ({ conversation }) => {
  const { theme } = useTheme();
  const { show, nodeRef, triggerRef } = useDetectClickOutside(false);
  const { setValue, register, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (show && nodeRef.current) {
      nodeRef.current.scrollIntoView();
    }
  }, [show, nodeRef]);

  const onSubmit: SubmitHandler<FieldValues> = ({ message }) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/pings", {
        message: encryptMessage(message as string),
        conversationId: conversation.id,
      })
      .catch(() => toast.error("An error occurred, Please try again later"));
  };

  const addEmoji = useCallback(
    ({ native }: { native: string }) => {
      const value = watch("message");
      setValue("message", value + native);
    },
    [watch, setValue]
  );

  const handleStartRecording = async () => {
    try {
      const chunks: Blob[] = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const _onDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      const _onStopEvent = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        const s3Config = {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
          region: process.env.NEXT_PUBLIC_AWS_REGION!,
        };

        const s3Params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: `${randomBytes(5).toString("hex")}_voice`,
          Body: audioBlob,
          ACL: process.env.NEXT_PUBLIC_ACL_COMMAND!,
        };

        try {
          const response = await uploadAudioToS3(s3Config, s3Params);
          await uploadAudioUrlToServer(response.Location, conversation.id);
        } catch (error) {
          toast.error("An error occurred. Please try again later.");
        }
      };

      mediaRecorderRef.current = startMediaRecorder(
        mediaRecorder,
        _onDataAvailable,
        _onStopEvent
      );
      setRecording(true);
    } catch (error) {
      toast.error("Failed to access microphone");
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      setRecording(false);
    }
  };

  return (
    <div className="w-full p-4 border-t dark:bg-neutral-900 border-gray-50/10 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center relative"
      >
        <PingInput
          id="message"
          placeholder="Send a message"
          register={register}
          required
        />

        <div
          ref={nodeRef}
          className={clsx({
            ["absolute hidden top-14 sm:top-auto sm:bottom-14 pb-4 w-full sm:w-fit sm:pb-0 sm:right-12 transition-all duration-700"]:
              true,
            ["!flex flex-col xs:items-center !duration-500"]: show,
          })}
        >
          <Picker
            data={data}
            previewPosition="none"
            emojiButtonRadius="8px"
            emojiSize={27}
            theme={theme}
            emojiButtonColors={[
              "rgba(155,223,88,.7)",
              "rgba(149,211,254,.7)",
              "rgba(247,233,34,.7)",
              "rgba(238,166,252,.7)",
              "rgba(255,213,143,.7)",
              "rgba(211,209,255,.7)",
            ]}
            onEmojiSelect={addEmoji}
          />
        </div>

        <div className="absolute space-x-2 right-0 pr-2 flex items-center justify-between">
          <div ref={triggerRef}>
            <button
              type="button"
              className="p-1.5 hover:bg-yellow-50 hover:dark:bg-sky-100 duration-500 rounded-full"
            >
              <GrEmoji
                size={25}
                className="text-yellow-500 dark:text-sky-500"
              />
            </button>
          </div>
          <button type="button">
            {recording ? (
              <FaStop
                className="text-rose-500 animate-pulse"
                size={23}
                onClick={handleStopRecording}
              />
            ) : (
              <FaMicrophone
                size={19}
                className="text-gray-500"
                onClick={handleStartRecording}
              />
            )}
          </button>

          <button
            type="submit"
            className="cursor-pointer p-1 hover:bg-sky-100 duration-500 rounded-full"
          >
            <RiSendPlaneFill size={24} className="text-sky-500 rotate-45 " />
          </button>
        </div>
      </form>
    </div>
  );
};
