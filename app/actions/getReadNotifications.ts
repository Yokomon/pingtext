import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getReadNotifications = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];

    // If currentUser is the sender
    const currentUserReadNotifications = await prismadb.notification.findMany({
      where: {
        senderId: currentUser.id,
        // Then read notifications should be those read by the user
        readBySender: true,
      },
      include: {
        sender: true,
        friend: true,
        recipient: true,
      },
    });

    if (!currentUserReadNotifications.length) {
      const recipientNotifications = await prismadb.notification.findMany({
        where: {
          recipientId: currentUser?.id,
          readByRecipient: true,
        },
        include: {
          sender: true,
          friend: true,
          recipient: true,
        },
      });

      return recipientNotifications;
    }

    return currentUserReadNotifications;
  } catch (error) {
    return [];
  } finally {
    await prismadb.$disconnect();
  }
};
