import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

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

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        pings: true,
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
      const updatedPing = await prisma.pings.update({
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
          sender: true,
        },
      });

      await pusherServer.trigger("conversations", "conversations:update", {
        newPing: updatedPing,
        conversationId,
      });

      await pusherServer.trigger(conversationId, "ping:updated", updatedPing);

      return NextResponse.json("Conversation updated");
    }

    const { count } = await prisma.pings.updateMany({
      where: {
        conversationId: conversationId,
      },
      data: {
        receiverIds: [currentUser.id, lastPing.senderId],
      },
    });

    if (count) {
      const newPing = await prisma.pings.findFirst({
        where: {
          id: lastPing.id,
        },
        include: {
          sender: true,
        },
      });

      await pusherServer.trigger("conversations", "conversations:update", {
        newPing: newPing,
        conversationId,
      });

      await pusherServer.trigger(conversationId, "ping:updated", newPing);
    }

    return NextResponse.json("Conversation updated!");
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
