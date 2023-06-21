import { NextResponse } from "next/server";
import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export async function getAllFriends() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const friends = await prismadb.friend.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
        accepted: true,
      },
      include: {
        users: {
          where: {
            email: {
              not: currentUser.email,
            },
          },
        },
      },
    });

    return friends.map((friend) => ({ ...friend, users: friend.users[0] }));
  } catch (error) {
    new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    return null;
  } finally {
    await prismadb.$disconnect();
  }
}
