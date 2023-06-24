"use client";

import { useSession } from "next-auth/react";
import clsx from "clsx";

import { Avatar } from "@/app/components/Avatar";
import { FullPingType } from "@/types/PingsType";
import { formatDate } from "@/app/utils/formatDate";
import { decryptMessage } from "@/app/utils/encryption";

interface PingContainerProps {
  data: FullPingType;
}

export const PingContainer: React.FC<PingContainerProps> = ({ data }) => {
  const session = useSession();

  if (!session) return null;

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const container = clsx({
    ["flex gap-3 p-3 px-6"]: true,
    ["justify-end"]: isOwn,
  });

  const avatar = clsx({
    ["order-1"]: isOwn,
  });

  const body = clsx({
    ["flex flex-col gap-2"]: true,
    ["items-end"]: isOwn,
  });

  const message = clsx({
    ["text-sm dark:text-black overflow-hidden bg-gray-200 rounded-md py-2 px-3"]:
      true,
    ["!bg-sky-500 ml-[2rem] lg:ml-[8rem] !text-white"]: isOwn,
    ["mr-[2rem] lg:mr-[8rem]"]: !isOwn,
  });

  if (session.status === "loading") return null;

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar currentUser={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-200">
          <div className="text-sm">{data.sender.name}</div>
          <div className="text-[10px] text-gray-400">
            {formatDate(data.createdAt)}
          </div>
        </div>
        <div className={message}>{decryptMessage(data.body)}</div>
      </div>
    </div>
  );
};
