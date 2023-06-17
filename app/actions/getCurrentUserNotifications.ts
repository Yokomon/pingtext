import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getCurrentUserNotifications = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("User session not found", { error: 404 });
      return [];
    }

    // Check if the current user is the sender of the notification
    const currentUserUnreadNotifications = await prismadb.notification.findMany(
      {
        where: {
          senderId: currentUser.id,
          readBySender: false,
          // Check if the recipient has read and accepted it, in order to flag the user
          readByRecipient: true,
          friendRequestAccepted: true,
        },
        include: {
          sender: true,
          friend: true,
          recipient: true,
        },
      }
    );

    // Notifications above is empty?? Then current user is not the sender
    if (!currentUserUnreadNotifications.length) {
      // Else we fetch all notifications based on the unread flag
      const recipientNotifications = await prismadb.notification.findMany({
        where: {
          recipientId: currentUser.id,
          readByRecipient: false,
        },
        include: {
          sender: true,
          friend: true,
          recipient: true,
        },
      });

      return recipientNotifications;
    }

    return currentUserUnreadNotifications;
  } catch (error) {
    console.log("Current user notifications error", { error });
    return [];
  }
};
