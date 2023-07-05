import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { friendId } = body;

    if (!currentUser) return null;

    const newNotification = await prismadb.notification.create({
      data: {
        recipient: { connect: { id: friendId } },
        sender: { connect: { id: currentUser.id } },
        message: `You have a friend request from ${currentUser.name}`,
      },
    });

    const newFriendShip = await prismadb.friend.create({
      data: {
        users: { connect: [{ id: currentUser.id }, { id: friendId }] },
        requester: { connect: { id: currentUser.id } },
        notification: { connect: { id: newNotification.id } },
        requestSent: true,
      },
    });

    return NextResponse.json(newFriendShip);
  } catch (error) {
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  } finally {
    await prismadb.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const body = await req.json();

    const { friendId, notificationId, reject, userId } = body;

    const existingFriend = await prismadb.friend.findFirst({
      where: {
        requesterId: userId,
      },
    });

    if (!existingFriend) {
      return new NextResponse("Friend does not exist!", { status: 404 });
    }

    if (!notificationId) {
      return new NextResponse("Notification does not exist", { status: 404 });
    }

    const result = await prismadb.$transaction([
      prismadb.friend.update({
        where: {
          id: friendId,
        },
        data: {
          accepted: reject ? false : true,
        },
      }),
      prismadb.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          message: reject
            ? "Rejected friend request"
            : "Friend request accepted.",
          friendRequestAccepted: reject ? false : true,
        },
      }),
    ]);

    return NextResponse.json(result);
  } catch (error) {
    console.log({ error });
    return null;
  } finally {
    await prismadb.$disconnect();
  }
}
