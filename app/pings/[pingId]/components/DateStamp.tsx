"use client";

import { useSession } from "next-auth/react";

interface DateStampProps {
  data: string | null;
}

export const DateStamp: React.FC<DateStampProps> = ({ data }) => {
  const session = useSession();

  if (!session.data) return null;

  return (
    <div className="relative flex flex-col items-center">
      <div className="my-10 px-6 border-b border-gray-300 dark:border-gray-50/10 w-11/12" />
      <div className="block absolute top-1/4 px-5 p-1.5 rounded-md text-xs text-gray-600 bg-white dark:bg-black dark:text-gray-400 dark:ring-0 ring-1 ring-gray-300 shadow-sm">
        {data}
      </div>
    </div>
  );
};
