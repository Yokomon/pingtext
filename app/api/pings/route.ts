import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return new NextResponse("Invalid session", { status: 401 });

    const { message, conversationId, audioUrl } = await req.json();

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
        sender: true,
      },
    });

    await pusherServer.trigger(conversationId, "pings:new", newPing);

    await prismadb.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastPingAt: new Date(),
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

    return NextResponse.json(newPing);
  } catch (error) {
    console.log({ error });
    return new NextResponse("An error occured", { status: 500 });
  }
}
