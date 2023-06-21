"use client";

import { BiMessageDetail } from "@react-icons/all-files/bi/BiMessageDetail";

import { Avatar } from "@/app/components/Avatar";
import { SearchInput } from "@/app/components/inputs/SearchInput";
import { FullConversationType } from "@/types/ConversationTypes";

interface PingListProps {
  conversations: FullConversationType[];
}

export const PingList: React.FC<PingListProps> = ({ conversations }) => {
  return (
    <aside className="fixed  lg:block inset-0 lg:w-[27rem] lg:pl-20 border-r border-gray-50 dark:border-gray-50/10 shadow-sm p-4">
      <div className="px-5 pr-1">
        <h1 className="text-3xl mb-5 text-sky-600 font-semibold tracking-wide">
          Pings
        </h1>
        <SearchInput fullWidth id="searchPings" />
        <div>
          <div className="text-gray-500 dark:text-gray-200 flex items-center space-x-2 mt-8">
            <BiMessageDetail size={17} />
            <h4 className="text-sm">All Pings</h4>
          </div>
          {conversations.map(({ users, id }) => {
            const otherUser = users[0];
            return (
              <div
                key={id}
                className="flex my-3 w-full cursor-pointer hover:bg-gray-100 hover:text-black text-gray-700 dark:text-white dark:hover:text-gray-800 p-3 duration-300 rounded-md space-x-2 items-center"
              >
                <Avatar currentUser={otherUser} />
                <div className="min-w-0 w-full">
                  <div className="flex items-start justify-between w-full mb-2">
                    <h3 className="text-sm">{otherUser.name}</h3>
                    <p className="text-xs mt-0.5">11:35pm</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="truncate w-40 text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Esse labore dolores, ipsam ullam quos consequuntur
                      sapiente, beatae modi quod assumenda veniam odio? Unde
                      excepturi culpa vitae temporibus architecto quidem
                      inventore.
                    </p>
                    <span className="text-xs text-white bg-red-600 w-fit p-2 h-5 justify-center flex items-center rounded-full">
                      2
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
