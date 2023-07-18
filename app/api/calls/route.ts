import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return new NextResponse("Invalid user session", { status: 401 });

    const { friendId } = await request.json();

    // Check if the call exists to avoid creation on each requests
    const existingCall = await prisma.call.findFirst({
      where: {
        callerId: currentUser.id,
        callReceiverId: friendId,
      },
      include: {
        caller: true,
      },
    });

    if (existingCall) {
      await pusherServer.trigger("calls", "calls:new", {
        userId: friendId,
      });

      return NextResponse.json(existingCall);
    }

    const newCall = await prisma.call.create({
      data: {
        caller: {
          connect: {
            id: currentUser.id,
          },
        },
        callReceiver: {
          connect: {
            id: friendId,
          },
        },
      },
      include: {
        caller: true,
      },
    });

    await pusherServer.trigger("calls", "calls:new", {
      userId: friendId,
    });

    return NextResponse.json(newCall);
  } catch (error) {
    return new NextResponse("An error occured", { status: 500 });
  }
}
