"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RiSendPlaneFill } from "@react-icons/all-files/ri/RiSendPlaneFill";

import { PingInput } from "./PingInput";
import { FullConversationType } from "@/types/ConversationTypes";
import axios from "axios";
import { toast } from "react-hot-toast";

interface FooterProps {
  conversation: FullConversationType;
}

export const Footer: React.FC<FooterProps> = ({ conversation }) => {
  const { setValue, register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/pings", {
        ...values,
        conversationId: conversation.id,
      })
      .then(({ data }) => {
        console.log({ data });
      })
      .catch(() => toast.error("An error occurred, Please try again later"));
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
        <button
          type="submit"
          className="cursor-pointer absolute top-0 -right-2 mx-2 w-10 h-10"
        >
          <RiSendPlaneFill size={25} className="text-sky-600 rotate-45 " />
        </button>
      </form>
    </div>
  );
};
