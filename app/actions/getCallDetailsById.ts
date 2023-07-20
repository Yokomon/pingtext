import { getCurrentUser } from "./getCurrentUser";
import prismadb from "@/app/utils/prismadb";

export const getCallDetailsById = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const callDetails = await prismadb.call.findFirst({
      where: {
        id,
      },
      include: {
        callReceiver: true,
        caller: true,
      },
    });

    if (!callDetails) return null;

    return callDetails;
  } catch (error) {
    console.log(`Call details error: ${error}`);
    return null;
  }
};
