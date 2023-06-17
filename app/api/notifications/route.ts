import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const body = await req.json();

    const { notificationId, isUserSender } = body;

    if (!notificationId)
      return new NextResponse("Notification id not present", { status: 404 });

    if (isUserSender) {
      const userNotification = await prismadb.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          readBySender: true,
        },
      });

      return NextResponse.json(userNotification);
    }

    const updatedNotification = await prismadb.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        readByRecipient: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return new NextResponse("Cannot update notifications", { status: 500 });
  }
}
