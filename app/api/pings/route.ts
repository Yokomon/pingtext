import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";
import { pusherServer } from "@/app/lib/pusher";

interface IPOSTRequest {
  message: string;
  conversationId: string;
  audioUrl: string;
}

interface IPUTRequest {
  conversationId: string;
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return new NextResponse("Invalid session", { status: 401 });

    const { message, conversationId, audioUrl } =
      await (req.json() as Promise<IPOSTRequest>);

    const newPing = await prismadb.pings.create({
      data: {
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        receiver: {
          connect: {
            id: currentUser.id,
          },
        },
        body: message,
        audioUrl,
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

    const updatedConversation = await prismadb.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastPingAt: newPing.createdAt,
        pings: {
          connect: {
            id: newPing.id,
          },
        },
      },
      include: {
        users: true,
        pings: true,
      },
    });

    const lastPing =
      updatedConversation.pings[updatedConversation.pings.length - 1];

    await pusherServer.trigger(`presence-${conversationId}`, "pings:new", {
      newPing,
      conversationId,
    });

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversations:update", {
        conversationId,
        newPing: lastPing,
      });
    });

    return NextResponse.json(newPing);
  } catch (error) {
    return new NextResponse("An error occured", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return new NextResponse("Invalid session", { status: 401 });

    const { conversationId } = await (req.json() as Promise<IPUTRequest>);

    const existingPing = await prismadb.pings.findFirst({
      where: {
        conversationId,
      },
    });

    if (existingPing) {
      // Check if userId is present in clearedIds
      const isUserCleared =
        existingPing.clearedIds.indexOf(currentUser.id) !== -1;

      // Exit the condition to avoid duplicate ids
      if (isUserCleared)
        return NextResponse.json(`Cleared all pings successfully!`);

      await prismadb.pings.updateMany({
        where: {
          conversationId,
        },
        data: {
          // O(n) works fine with just 2 items
          clearedIds: existingPing.clearedIds.concat(currentUser.id),
        },
      });
    }

    return NextResponse.json(`Cleared all pings successfully!`);
  } catch (error) {
    console.log({ error });
    return new NextResponse("An error occured", { status: 500 });
  }
}
