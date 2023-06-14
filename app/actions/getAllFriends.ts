import prismadb from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export async function getAllFriends() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];

    const friends = await prismadb.friend.findMany({
      where: {
        friendId: currentUser.id,
        accepted: true,
      },
      include: {
        user: true,
      },
    });

    return friends;
  } catch (error) {
    return [];
  } finally {
    await prismadb.$disconnect();
  }
}
