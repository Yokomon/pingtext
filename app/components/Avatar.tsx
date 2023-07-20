"use client";

import { useMemo } from "react";
import Image from "next/image";

import { User } from "@prisma/client";
import { useStore } from "../hooks/useStore";
import useChannelList from "../hooks/useChannelList";

interface AvatarProps {
  currentUser: User | null;
  removeBadge?: boolean;
  imageWidth?: number;
  imageHeight?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  currentUser,
  removeBadge,
  imageWidth,
  imageHeight,
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
        {currentUser && "image" in currentUser && currentUser.image !== null ? (
          <div className="relative rounded-full overflow-hidden ring-1 dark:ring-0 dark:ring-offset-0 ring-offset-2 ring-sky-600 inline-block">
            <Image
              width={imageWidth ?? 40}
              height={imageHeight ?? 40}
              src={currentUser.image}
              alt={"avatar"}
              priority
              quality={100}
            />
          </div>
        ) : (
          // Render the initials of the user4
          <div className="h-10 w-10 ring-sky-500 ring-1 dark:ring-1 dark:ring-gray-500 ring-offset-2 rounded-full bg-gray-100 dark:bg-white flex items-center justify-center">
            {initials.map((el, idx) => (
              <span className="text-gray-500 text-sm" key={idx}>
                {el[0]}
              </span>
            ))}
          </div>
        )}
        {!removeBadge ? (
          isActive ? (
            <span className="absolute block bg-teal-400 right-1 top-7 rounded-full p-1 ring-1 dark:ring-0 dark:ring-offset-0 ring-white dark:ring-gray-400 ring-offset-2" />
          ) : (
            <span className="absolute block bg-slate-500 right-1 top-7 rounded-full p-1 ring-1 dark:ring-0 dark:ring-offset-0 ring-white dark:ring-gray-400 ring-offset-2" />
          )
        ) : null}
      </div>
    </div>
  );
};
