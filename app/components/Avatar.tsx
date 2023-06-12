"use client";

import Image from "next/image";

interface AvatarProps {
  src: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <div className="relative w-12">
      <div className="relative rounded-full overflow-hidden ring-1 ring-offset-2 ring-sky-600 inline-block">
        <Image
          className="max-w-[10rem]"
          width={40}
          src={src}
          alt={"avatar"}
          height={40}
          priority
        />
      </div>
      <span className="absolute block bg-teal-500 right-2 top-7 rounded-full p-1 ring-1 ring-white ring-offset-2" />
    </div>
  );
};
