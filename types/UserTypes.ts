import { Friend, User } from "@prisma/client";

export type MixedUsers = {
  user: User;
};

export type MixedFriends = {
  friends: Friend[];
};

export type AllFriends = Friend & {
  users: User;
};

export type FullFriendsTypes =
  | (Friend & {
      user: User;
    })
  | (Friend & {
      friend: User;
    });

export type FullUsersTypes = User & MixedFriends;
