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

    return pings;
  } catch (error) {
    return [];
  }
};
