import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/app/utils/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return new NextResponse("Invalid session", { status: 401 });

    const { message, conversationId } = await req.json();

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
      },
    });

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
    return new NextResponse("An error occured", { status: 500 });
  }
}