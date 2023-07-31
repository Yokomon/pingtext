import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";
import prismadb from "@/app/utils/prismadb";

interface IParams {
  conversationId: string;
}

export async function POST(_req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser)
      return new NextResponse("Unauthorized access", { status: 401 });
    if (!conversationId)
      return new NextResponse("Invalid access key", { status: 400 });

    const existingConversation = await prismadb.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        pings: { select: { id: true, senderId: true, receiverIds: true } },
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!existingConversation)
      return new NextResponse("Resource not found", { status: 404 });

    const lastPing =
      existingConversation.pings[existingConversation.pings.length - 1];

    if (!lastPing && existingConversation.lastPingAt !== null) {
      return new NextResponse("Ping not found", { status: 404 });
    }

    if (!lastPing && existingConversation.lastPingAt === null)
      return NextResponse.json("Conversation started");

    if (lastPing.receiverIds.length === 2)
      return NextResponse.json("Conversation updated");

    if (
      lastPing.senderId === currentUser.id &&
      lastPing.receiverIds.length === 1
    ) {
      const updatedPing = await prismadb.pings.update({
        where: {
          id: lastPing.id,
        },
        data: {
          receiver: {
            connect: {
              id: currentUser.id,
            },
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      await pusherServer.trigger(currentUser.email, "conversations:update", {
        newPing: updatedPing,
        conversationId,
      });

      return NextResponse.json("Conversation updated");
    }

    // // Update pings when both users sees last ping
    const { count } = await prismadb.pings.updateMany({
      where: {
        conversationId: conversationId,
      },
      data: {
        receiverIds: [currentUser.id, lastPing.senderId],
      },
    });

    if (count) {
      const lastModifiedPing = await prismadb.pings.findFirst({
        where: {
          id: lastPing.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      existingConversation.users.map((user) => {
        pusherServer.trigger(user.email, "conversations:update", {
          newPing: lastModifiedPing,
          conversationId,
        });
      });

      await pusherServer.trigger(
        `presence-${conversationId}`,
        "ping:updated",
        lastModifiedPing
      );

      return NextResponse.json("All Conversations updated!");
    }

    return NextResponse.json("Conversations updated");
  } catch (error) {
    console.log(`Conversation seen error: ${error}`);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
