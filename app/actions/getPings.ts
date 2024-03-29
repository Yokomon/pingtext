import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getPings = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];

    const pings = await prismadb.pings.findMany({
      where: {
        conversationId: id,
      },
      include: {
        sender: true,
      },
    });

    const filtered = pings.filter((ping) => ping.clearedIds.length === 0);

    if (filtered && filtered[0]?.senderId !== currentUser.id) {
      return filtered;
    }

    return pings;
  } catch (error) {
    console.log(`Get Pings error: ${error}`);
    return [];
  }
};
