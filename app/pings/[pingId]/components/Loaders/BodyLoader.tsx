"use client";

import { Avatar } from "@/app/components/Avatar";
import clsx from "clsx";

interface IBodyLoader {
  data: { isOwn: boolean };
}

export const BodyLoader: React.FC<IBodyLoader> = ({ data }) => {
  const isOwn = data.isOwn;

  const container = clsx({
    ["flex gap-3 p-2 px-6 my-4"]: true,
    ["justify-end"]: isOwn,
  });

  const avatar = clsx({
    ["order-1"]: isOwn,
  });

  const body = clsx({
    ["flex flex-col gap-1"]: true,
    ["items-end"]: isOwn,
  });

  const message = clsx({
    ["text-sm dark:text-black shadow-sm h-12 w-56 bg-gray-200 dark:bg-gray-700 animate-pulse overflow-hidden rounded-md py-2 px-3"]:
      true,
    ["ml-[2rem] lg:ml-[8rem]"]: isOwn,
    ["mr-[2rem] lg:mr-[8rem]"]: !isOwn,
  });

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar loading />
      </div>
      <div className={body}>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-200">
          <div className="h-2 w-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-1 w-12 bg-gray-200 animate-pulse dark:bg-gray-700" />
        </div>
        <div className={message} />
      </div>
    </div>
  );
};
