"use client";

import clsx from "clsx";
import { Fragment } from "react";
import axios from "axios";
import { Popover, Transition } from "@headlessui/react";
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HiOutlineDotsHorizontal } from "@react-icons/all-files/hi/HiOutlineDotsHorizontal";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";

import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { useStore } from "@/app/hooks/useStore";
import useChannelList from "@/app/hooks/useChannelList";

interface HeaderProps {
  otherUser: User;
}

export const Header: React.FC<HeaderProps> = ({ otherUser }) => {
  const router = useRouter();

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

  const handleCall = (friendId: string) => {
    callMutation.mutate({ friendId });
  };

  return (
    <div className="flex items-center p-4 h-20 justify-between border-b border-gray-100 dark:bg-neutral-900 dark:border-gray-50/10 w-full shadow-sm">
      <div className="p-2 hover:bg-sky-100 rounded-full duration-500 lg:hidden">
        <MdArrowBack
          size={24}
          className="hover:text-sky-600 cursor-pointer text-gray-500"
        />
      </div>
      <div className="ml-5 flex flex-1 space-x-3">
        <Avatar currentUser={otherUser} />
        <div>
          <h4 className="text-gray-700 dark:text-gray-200">{otherUser.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isUserOnline ? "Available" : "Offline"}
          </p>
        </div>
      </div>
      <Popover className="relative">
        {({ open }) => (
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
                  <div className="relative bg-white h-32 w-48">
                    <ul className="flex flex-col p-2 px-3 list-none">
                      <li
                        onClick={() => handleCall(otherUser.id)}
                        className="flex items-center p-2 cursor-pointer rounded-lg hover:bg-sky-100"
                      >
                        <h4 className="flex-1 text-base">
                          Call {otherUser.name}
                        </h4>
                        <BsCameraVideoFill size={18} className="fill-sky-600" />
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
  );
};
