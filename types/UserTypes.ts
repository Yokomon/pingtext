import { Friend, User } from "@prisma/client";

export type MixedUsers = {
  user: User;
};

export type MixedFriends = {
  friend: Friend | null
}

export type FullFriendsTypes = Friend & MixedUsers;

export type FullUsersTypes = User & MixedFriends