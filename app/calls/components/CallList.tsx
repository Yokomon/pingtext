"use client";

import clsx from "clsx";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { BsFillCameraVideoFill } from "@react-icons/all-files/bs/BsFillCameraVideoFill";
import { MdCall } from "@react-icons/all-files/md/MdCall";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { AllFriends } from "@/types/UserTypes";
import { Avatar } from "@/app/components/Avatar";

interface CallListProps {
  friends: AllFriends[] | null;
}

export const CallList = ({ friends }: CallListProps) => {
  const router = useRouter();
  const params = useParams();

  const isOpen = !!params?.callId;

  const callMutation = useMutation({
    mutationFn: (values: { friendId: string }) => {
      return axios.post(`/api/calls`, values);
    },
    onSuccess: async function ({ data }) {
      return router.push(`/calls/${data.id}`);
    },
  });

  const handleCall = (friendId: string) => {
    callMutation.mutate({ friendId });
  };

  return (
    <div>
      <aside
        className={clsx({
          ["inset-0 lg:block dark:bg-neutral-900 lg:pl-20 fixed border-r border-gray-50 dark:border-gray-50/10 shadow-sm p-4 lg:w-[27rem]"]:
            true,
          ["hidden"]: isOpen,
        })}
      >
        <section className="px-5 pr-1">
          <h1 className="text-3xl mb-5 text-sky-600 font-semibold tracking-wide">
            Calls
          </h1>
          <SearchInput placeholder="Search calls" id="searchCalls" fullWidth />
          <div className="my-6">
            <div className="text-gray-400 flex items-center space-x-3">
              <MdCall size={19} />
              <h4 className="text-base dark:text-gray-200">All calls</h4>
            </div>
            {!friends?.length ? (
              <p className="text-sm my-10 text-gray-400 dark:text-gray-200 text-center">
                No calls at the moment
              </p>
            ) : (
              friends.map(({ users }) => (
                <div
                  key={users.id}
                  className="flex justify-between items-center my-5 space-x-4"
                >
                  <Avatar currentUser={users} />
                  <div className="h-full relative flex flex-col flex-1 mx-3 space-y-1 text-gray-700 dark:text-gray-300">
                    <h4 className="text-sm">{users.name}</h4>
                    <p className="text-xs text-gray-400 truncate w-40">
                      {users.email}
                    </p>
                  </div>
                  <BsFillCameraVideoFill
                    onClick={() => handleCall(users.id)}
                    size={18}
                    className="text-sky-600 dark:text-sky-500 cursor-pointer"
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </aside>
    </div>
  );
};
