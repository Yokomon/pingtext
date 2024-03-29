"use client";

import { useMemo } from "react";
import Image from "next/image";

import { User } from "@prisma/client";
import { useStore } from "../hooks/useStore";
import useChannelList from "../hooks/useChannelList";

interface AvatarProps {
  currentUser?: User | null;
  removeBadge?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  loading?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  currentUser,
  removeBadge,
  imageWidth,
  imageHeight,
  loading,
}) => {
  const members = useStore(useChannelList, (state) => state.members);

  const isActive = members.has(currentUser?.email!);

  const initials = useMemo(() => {
    if (currentUser && "name" in currentUser) {
      return currentUser.name?.toUpperCase()?.split(" ") as string[];
    }
    return [];
  }, [currentUser]);

  return (
    <div>
      <div className="relative flex justify-center items-center">
        {/* Check if current user and image exists */}
        {loading ? (
          <div className="relative animate-pulse rounded-full overflow-hidden ring-1 dark:ring-0 dark:ring-offset-0 ring-offset-2 ring-sky-600 inline-block h-12 w-12 bg-gray-200 dark:bg-gray-700" />
        ) : currentUser &&
          "image" in currentUser &&
          currentUser.image !== null ? (
          <div className=" relative rounded-full overflow-hidden ring-1 dark:ring-0 dark:ring-offset-0 ring-offset-2 ring-sky-600 inline-block">
            <Image
              unoptimized
              width={imageWidth ?? 46}
              height={imageHeight ?? 40}
              src={currentUser.image}
              alt={"avatar"}
              priority
              quality={100}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          // Render the initials of the user4
          <div className="h-9 w-9 ring-sky-500 ring-1 dark:ring-1 dark:ring-gray-500 ring-offset-2 rounded-full bg-gray-100 dark:bg-white flex items-center justify-center">
            {initials.map((el, idx) => (
              <span className="text-gray-500 text-sm" key={idx}>
                {el[0]}
              </span>
            ))}
          </div>
        )}
        {!removeBadge && !loading ? (
          isActive ? (
            <span className="absolute block bg-teal-500 right-0 top-7 rounded-full p-1 ring-1 ring-offset-1 dark:ring-0 dark:ring-offset-0 ring-teal-400 dark:ring-gray-400" />
          ) : (
            <span className="absolute block bg-slate-500 right-0 top-7 rounded-full p-1 ring-1 dark:ring-offset-2 ring-white dark:ring-gray-400 ring-offset-2" />
          )
        ) : null}
      </div>
    </div>
  );
};
