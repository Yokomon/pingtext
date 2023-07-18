import { getCurrentUser } from "./getCurrentUser";

export const getCallDetailsById = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const callDetails = await prisma.call.findFirst({
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
    return null;
  }
};
