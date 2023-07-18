import { User } from "@prisma/client";
import { enhanceGoogleImg } from "../utils/modifyGoogleImage";
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

    const userData = {
      ...currentUser,
      image: enhanceGoogleImg(currentUser.image),
    };

    return userData as User;
  } catch (error) {
    return null;
  }
};
