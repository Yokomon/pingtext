import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { friendId } = body;

    if (!currentUser) return null;

    const friendShip = await prismadb.friend.create({
      data: {
        user: { connect: { id: currentUser.id } },
        friend: { connect: { id: friendId } },
        requestSent: true,
      },
    });

    await prismadb.notification.create({
      data: {
        recipient: { connect: { id: friendId } },
        sender: { connect: { id: currentUser.id } },
        message: `You have a friend request from ${currentUser.name}`,
      },
    });

    return NextResponse.json(friendShip);
  } catch (error) {
    console.log({ error });
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

    const { friendId, recipientId, notificationId, reject } = body;

    const existingFriend = await prismadb.friend.findFirst({
      where: {
        userId: friendId,
        friendId: recipientId,
      },
    });

    if (!existingFriend) {
      return new NextResponse("Friend does not exist!", { status: 404 });
    }

    if (!notificationId) {
      return new NextResponse("Notification does not exist", { status: 404 });
    }

    const updateFriendRequest = await prismadb.friend.update({
      where: {
        userId: friendId,
      },
      data: {
        accepted: reject ? false : true,
      },
    });

    await prismadb.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        message: reject
          ? "Rejected friend request"
          : "Friend request accepted.",
      },
    });

    return NextResponse.json(updateFriendRequest);
  } catch (error) {
    console.log({ error });
    return null;
  } finally {
    await prismadb.$disconnect();
  }
}
