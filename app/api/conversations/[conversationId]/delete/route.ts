import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  conversationId: string;
}

export async function DELETE(_req: Request, { conversationId }: IParams) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    if (!conversationId) return null;

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json(`Deleted conversation with id: ${conversationId}`);
  } catch (error) {
    return null;
  }
}
