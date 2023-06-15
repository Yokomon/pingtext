"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FaUserFriends } from "@react-icons/all-files/fa/FaUserFriends";
import { AiOutlineCompass } from "@react-icons/all-files/ai/AiOutlineCompass";
import { TiUserAdd } from "@react-icons/all-files/ti/TiUserAdd";
import { RiUserFollowFill } from "@react-icons/all-files/ri/RiUserFollowFill";
import { User } from "@prisma/client";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { Avatar } from "@/app/components/Avatar";
import { FullFriendsTypes, FullUsersTypes } from "@/types/UserTypes";
import { Modal } from "@/app/components/Modal";
import { DynamicStateType } from "@/types/DynamicState";
import { useMutation } from "@tanstack/react-query";

interface FriendsListProps {
  friends: FullFriendsTypes[];
  otherUsers: FullUsersTypes[];
  currentUser: User | null;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  otherUsers,
  currentUser,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [dynamicState, setDynamicState] = useState<DynamicStateType>({
    user: null,
    message: "",
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
      />
      <aside className="lg:pl-20 fixed inset-0 bg-white lg:w-[27rem] border-r border-gray-50 shadow-sm p-4">
        <section className="px-5 pr-1">
          <h1 className="text-3xl mb-5 text-sky-600 font-semibold tracking-wide">
            Friends
          </h1>
          <SearchInput placeholder="Find friends" id="findFriends" fullWidth />
          <div className="my-6">
            <div className="text-gray-400 flex items-center space-x-3">
              <FaUserFriends size={19} />
              <h4 className="text-base">All friends</h4>
            </div>
            {!friends.length ? (
              <p className="my-10 text-sm text-gray-400 text-center">
                No friends added
              </p>
            ) : (
              friends.map(({ user }) => (
                <div
                  key={user.id}
                  className="w-full flex items-start my-6 space-x-3"
                >
                  <Avatar currentUser={user} />
                  <div className="relative">
                    <div className="flex items-center">
                      <h3 className="text-sm text-gray-600">{user.name}</h3>
                    </div>
                    <span className="text-xs">Available</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="my-6">
            <div className="flex items-center text-gray-400 space-x-3">
              <AiOutlineCompass size={19} />
              <h4>Discover friends</h4>
            </div>

            <div className="[&>*:nth-child(1)]:mt-5">
              {otherUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-full flex items-start my-6 space-x-3"
                >
                  <Avatar currentUser={user} />
                  <div className="relative w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm text-gray-600">{user.name}</h3>
                      {user.friend?.friendId === currentUser?.id ? (
                        <RiUserFollowFill
                          size={36}
                          className="text-sky-600 absolute right-0 top-1 p-2"
                        />
                      ) : (
                        <TiUserAdd
                          size={36}
                          onClick={() => enableModal(user)}
                          className="text-sky-600 duration-500 absolute right-0 top-1 p-2 cursor-pointer hover:bg-sky-100 rounded-md"
                        />
                      )}
                    </div>
                    <span className="text-xs">Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
};
