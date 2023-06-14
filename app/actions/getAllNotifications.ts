import prismadb from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getAllNotifications = async (flag: "read" | "unread") => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];

    const notifications = await prismadb.notification.findMany({
      where: {
        recipientId: currentUser?.id,
        read: flag === "read" ? true : false,
      },
      include: {
        sender: true,
      },
    });

    return notifications;
  } catch (error) {
    return [];
  } finally {
    await prismadb.$disconnect();
  }
};
