import { enhanceGoogleImg } from "../utils/modifyGoogleImage";
import prismadb from "../utils/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export default async function getOtherUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const otherUsers = await prismadb.user.findMany({
      where: {
        NOT: {
          email: currentUser.email,
        },
      },
      include: {
        friends: {
          where: {
            accepted: true,
            userIds: {
              has: currentUser.id,
            },
          },
        },
      },
    });

    if (otherUsers.length === 0) return [];

    return otherUsers.map((user) => ({
      ...user,
      image: enhanceGoogleImg(user.image),
    }));
  } catch (error) {
    console.log(`Get otherUsers error: ${error}`);
    return [];
  } finally {
    await prismadb.$disconnect();
  }
}
