"use client";

import { Avatar } from "@/app/components/Avatar";

export const HeaderLoader = () => {
  return (
    <div className="flex items-center p-4 h-20 justify-between border-b border-gray-100 dark:bg-neutral-900 dark:border-gray-50/10 w-full shadow-sm">
      <div className="ml-5 flex flex-1 space-x-3">
        <Avatar loading />
        <div className="pt-2">
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full w-48" />
          <div className="h-2 my-2 max-w-[100px] bg-gray-200 animate-pulse dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
