import prismadb from "../utils/prismadb";
import getSession from "./getSession";

export const getCurrentUser = async () => {
  const session = await getSession();
  try {
    if (!session) return null;

    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error) {
    return null;
  }
};
