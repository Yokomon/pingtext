import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/libs/prismadb";

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const body = await req.json();

    const { notificationId } = body;

    if (!notificationId)
      return new NextResponse("Notification id not present", { status: 404 });

    const updatedNotification = await prismadb.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return new NextResponse("Cannot update notifications", { status: 500 });
  }
}
