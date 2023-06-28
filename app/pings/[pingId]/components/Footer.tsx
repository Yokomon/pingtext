"use client";

import axios from "axios";
import { useCallback, useEffect } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RiSendPlaneFill } from "@react-icons/all-files/ri/RiSendPlaneFill";
import { GrEmoji } from "@react-icons/all-files/gr/GrEmoji";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { PingInput } from "./PingInput";
import { FullConversationType } from "@/types/ConversationTypes";
import { encryptMessage } from "@/app/utils/encryption";
import useDetectClickOutside from "@/app/hooks/useDetectClickOutside";

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

        <div className="absolute right-0 pr-2 flex items-center justify-between">
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
