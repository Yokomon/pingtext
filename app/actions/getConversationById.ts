import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getConversationById = async (pingId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const conversation = await prismadb.conversation.findFirst({
      where: {
        id: pingId,
      },
      include: {
        users: {
          where: {
            id: {
              notIn: [currentUser.id],
            },
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.log(`Get conversation by ID error: ${error}`);
    return null;
  }
};
