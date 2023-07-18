import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    callId: string;
  };
}

export async function POST(_: Request, { params }: IParams) {
  try {
    const currentUser = await getCurrentUser();
    const { callId } = params;

    if (!currentUser)
      return new NextResponse("Invalid user session", { status: 401 });

    // Find existing call and initiate the call if it exists
    const existingCall = await prisma.call.findFirst({
      where: {
        id: callId,
      },
    });

    if (!existingCall) {
      return new NextResponse("Call record does not exists", { status: 404 });
    }

    // Call event triggered
    await pusherServer.trigger(
      existingCall.id,
      "calls:initiated",
      existingCall
    );

    return NextResponse.json(existingCall);
  } catch (error) {
    console.log(`CallId error: ${error}`);
    return new NextResponse("An error occurred. Please try again later", {
      status: 500,
    });
  }
}
