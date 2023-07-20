import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) return [];

    const userConversations = await prismadb.conversation.findMany({
      orderBy: {
        lastPingAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: {
          where: {
            email: {
              notIn: [currentUser.email],
            },
          },
        },
        pings: true,
      },
    });

    return userConversations;
  } catch (error) {
    console.log(`Get all conversations error: ${error}`);
    return [];
  }
};
