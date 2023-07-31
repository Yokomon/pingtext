"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FaUserFriends } from "@react-icons/all-files/fa/FaUserFriends";
import { AiOutlineCompass } from "@react-icons/all-files/ai/AiOutlineCompass";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { AllFriends, FullUsersTypes } from "@/types/UserTypes";
import { Modal } from "@/app/components/Modal";
import { DynamicStateType } from "@/types/DynamicState";
import { FriendsBox } from "./FriendsBox";

interface FriendsListProps {
  userFriends: AllFriends[];
  otherUsers: FullUsersTypes[];
}

export const FriendsList: React.FC<FriendsListProps> = ({
  userFriends,
  otherUsers,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [dynamicState, setDynamicState] = useState<DynamicStateType>({
    user: null,
    message: "",
    friend: null,
  });

  const mutation = useMutation({
    mutationFn: (values: { friendId: string }) => {
      return axios.post("/api/friends", values);
    },
    onSuccess: async () => {
      setOpenModal(!openModal);
      toast.success(`✌️ Friend request sent to ${dynamicState.user?.name}`);
    },
    onError: async () => {
      toast.error("An error occurred, please try again later");
    },
  });

  const onClose = () => setOpenModal(!openModal);

  const enableModal = useCallback(
    (user: User) => {
      setDynamicState((content) => ({
        ...content,
        user,
        message: `Do you wish to add ${user.name} as a friend?`,
      }));
      setOpenModal(!openModal);
    },
    [openModal]
  );

  // Function used to instantiate a new friend connection
  const createPingFriend = useCallback(() => {
    if (dynamicState.user === null) return;
    mutation.mutate({ friendId: dynamicState.user.id });
  }, [mutation, dynamicState]);

  return (
    <div>
      <Modal
        isOpen={openModal}
        onClose={onClose}
        title="Add new friend"
        content={dynamicState.message}
        primaryText="Proceed"
        primaryAction={createPingFriend}
        isLoading={mutation.isLoading}
      />
      <aside className="lg:pl-20 fixed dark:bg-slate-900 inset-0 lg:w-[27rem] border-r border-gray-50 dark:border-gray-50/10 shadow-sm p-4">
        <section className="px-5 pr-1">
          <h1 className="text-3xl mb-5 text-sky-600 font-semibold tracking-wide">
            Friends
          </h1>
          <SearchInput placeholder="Find friends" id="findFriends" fullWidth />
          <div className="my-6">
            <div className="text-gray-400 flex items-center space-x-3">
              <FaUserFriends size={19} />
              <h4 className="text-base dark:text-gray-200">All friends</h4>
            </div>
            {!userFriends.length ? (
              <p className="my-10 text-sm text-gray-400 dark:text-gray-200 text-center">
                No friends added
              </p>
            ) : (
              userFriends.map(({ users }) => (
                <FriendsBox user={users} key={users.id} />
              ))
            )}
          </div>
          <div className="my-6">
            <div className="flex items-center text-gray-400 dark:text-gray-200 space-x-3">
              <AiOutlineCompass size={19} />
              <h4>Discover friends</h4>
            </div>

            <div className="[&>*:nth-child(1)]:mt-5">
              {otherUsers.map(({ friends, ...user }) => {
                const [accepted] = [friends[0]?.accepted];
                return (
                  <FriendsBox
                    discovery
                    enableModal={enableModal}
                    friendShipAccepted={accepted}
                    user={user}
                    key={user.id}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
};
