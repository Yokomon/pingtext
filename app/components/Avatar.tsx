"use client";

import { useMemo } from "react";
import { Friend, User } from "@prisma/client";
import Image from "next/image";

interface AvatarProps {
  currentUser: User | Friend;
}

export const Avatar: React.FC<AvatarProps> = ({ currentUser }) => {
  const initials = useMemo(() => {
    if (currentUser && "name" in currentUser) {
      return currentUser.name?.toUpperCase()?.split(" ") as string[];
    }
    return [];
  }, [currentUser]);

  return (
    <div>
      <div className="w-12 relative flex justify-center items-center">
        {/* Check if current user and image exists */}
        {currentUser && "image" in currentUser && currentUser.image !== null ? (
          <div className="relative rounded-full overflow-hidden ring-1 ring-offset-2 ring-sky-600 inline-block">
            <Image
              className="max-w-[10rem]"
              width={40}
              src={currentUser.image}
              alt={"avatar"}
              height={40}
              priority
            />
          </div>
        ) : (
          // Render the initials of the user
          <div className="h-10 w-10 ring-sky-500 ring-1 ring-offset-2 rounded-full bg-gray-100 dark:bg-white flex items-center justify-center">
            {initials.map((el, idx) => (
              <span className="text-gray-500 text-sm" key={idx}>
                {el[0]}
              </span>
            ))}
          </div>
        )}
        <span className="absolute block bg-teal-500 right-1 top-7 rounded-full p-1 ring-1 ring-white dark:ring-gray-400 ring-offset-2" />
      </div>
    </div>
  );
};
