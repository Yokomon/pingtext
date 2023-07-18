import { User } from "@prisma/client";
import { enhanceGoogleImg } from "../utils/modifyGoogleImage";
import getSession from "./getSession";

export const getOtherUserById = async (id: string) => {
  const session = await getSession();
  if (!id) return null;
  try {
    if (!session) return null;

    const otherUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!otherUser) return null;

    const otherUserData = {
      ...otherUser,
      image: enhanceGoogleImg(otherUser.image),
    };

    return otherUserData as User;
  } catch (error) {}
};
