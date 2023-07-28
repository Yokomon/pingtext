"use client";

import clsx from "clsx";
import { Fragment } from "react";
import axios from "axios";
import { Popover, Transition } from "@headlessui/react";
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineDotsHorizontal } from "@react-icons/all-files/hi/HiOutlineDotsHorizontal";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";
import { FiTrash2 } from "@react-icons/all-files/fi/FiTrash2";
import { AiOutlineClear } from "@react-icons/all-files/ai/AiOutlineClear";

import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { useStore } from "@/app/hooks/useStore";
import useChannelList from "@/app/hooks/useChannelList";

interface HeaderProps {
  otherUser: User;
}

export const Header: React.FC<HeaderProps> = ({ otherUser }) => {
  const router = useRouter();
  const params = useParams();

  const members = useStore(useChannelList, (state) => state.members);
  const isUserOnline = members.has(otherUser.email);

  const callMutation = useMutation({
    mutationFn: (values: { friendId: string }) => {
      return axios.post(`/api/calls`, values);
    },
    onSuccess: async function ({ data }) {
      return router.push(`/calls/${data.id}`);
    },
  });

  const clearPingsMutation = useMutation({
    mutationFn: (values: { conversationId: string }) => {
      return axios.put(`/api/pings`, values);
    },
  });

  const handleCall = (friendId: string) => {
    callMutation.mutate({ friendId });
  };

  const clearAllPings = (conversationId: string) =>
    clearPingsMutation.mutate({ conversationId });

  return (
    <div className="flex items-center p-4 h-20 justify-between border-b border-gray-100 dark:bg-neutral-900 dark:border-gray-50/10 w-full shadow-sm">
      <div className="p-2 hover:bg-sky-100 rounded-full duration-500 lg:hidden">
        <MdArrowBack
          size={24}
          className="hover:text-sky-600 cursor-pointer text-gray-500"
        />
      </div>
      <div className="ml-5 flex flex-1 space-x-3 items-center">
        <div className="relative w-9">
          <Avatar currentUser={otherUser} />
        </div>
        <div>
          <h4 className="text-gray-700 dark:text-gray-200">{otherUser.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isUserOnline ? "Available" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div
          onClick={() => handleCall(otherUser.id)}
          className="p-3 hover:dark:bg-sky-50 hover:bg-sky-100 cursor-pointer rounded-full duration-500 hidden xs:block"
        >
          <BsCameraVideoFill size={20} className="fill-sky-600" />
        </div>
        <Popover className="relative">
          {({ open, close }) => (
            <>
              <Popover.Button
                className={clsx({
                  ["p-2 rounded-full hover:bg-sky-100 duration-500 focus:outline-sky-200 text-gray-500 hover:text-sky-600 cursor-pointer"]:
                    true,
                  ["hover:!text-sky-700 hover:!bg-sky-300"]: open,
                })}
              >
                <HiOutlineDotsHorizontal size={26} aria-hidden />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute max-w-sm right-1/2 z-10 my-4">
                  <div className="overflow-hidden shadow-md ring-1 ring-opacity-10 ring-black rounded-md">
                    <div className="relative bg-white w-52">
                      <ul className="flex flex-col p-3 py-4 list-none duration-500 text-black">
                        <li className="flex items-center p-2 cursor-pointer rounded-md duration-700 hover:bg-sky-100">
                          <h5 className="flex-1 text-sm">View profile</h5>
                        </li>
                        <li
                          onClick={() => handleCall(otherUser.id)}
                          className="flex xs:hidden items-center p-2 cursor-pointer rounded-md duration-700 hover:bg-sky-100"
                        >
                          <h5 className="flex-1 text-sm tracking-wide">
                            Video call
                          </h5>
                          <BsCameraVideoFill
                            size={19}
                            className="fill-sky-600"
                          />
                        </li>
                        <li
                          className="flex items-center p-2 cursor-pointer rounded-md duration-700 hover:bg-rose-100"
                          onClick={() => {
                            clearAllPings(params?.pingId as string);
                            close();
                          }}
                        >
                          <h5 className="flex-1 text-sm text-rose-500 tracking-wide">
                            Clear pings
                          </h5>
                          <AiOutlineClear className="text-rose-500" size={19} />
                        </li>
                        <li className="flex items-center p-2 cursor-pointer rounded-md duration-700 hover:bg-rose-100">
                          <h5 className="flex-1 text-sm text-rose-500 tracking-wide">
                            Delete ping
                          </h5>
                          <FiTrash2 className="text-rose-500" size={19} />
                        </li>
                      </ul>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};
