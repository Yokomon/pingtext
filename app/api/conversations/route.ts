import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email)
      return new NextResponse("User session is invalid or expired", {
        status: 401,
      });

    const { id: friendId } = await req.json();

    if (!friendId)
      return new NextResponse("User id not found", { status: 404 });

    // We need to check if the conversation already exists
    // to avoid duplicates conversations in DB
    const existingConversations = await prismadb.conversation.findFirst({
      where: {
        userIds: {
          equals: [friendId, currentUser.id],
        },
      },
      include: {
        users: true,
        pings: true,
      },
    });

    if (!existingConversations) {
      // If existing conversation doesn't exist
      // We create a new conversation.
      const newConversation = await prismadb.conversation.create({
        data: {
          users: {
            connect: [{ id: currentUser.id }, { id: friendId }],
          },
        },
        include: {
          users: true,
          pings: true,
        },
      });

      newConversation.users.forEach((user) => {
        pusherServer.trigger(user.email, "conversations:new", newConversation);
      });

      return NextResponse.json(newConversation);
    }

    existingConversations.users.forEach((user) => {
      pusherServer.trigger(
        user.email,
        "conversations:new",
        existingConversations
      );
    });

    return NextResponse.json(existingConversations);
  } catch (error) {
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
