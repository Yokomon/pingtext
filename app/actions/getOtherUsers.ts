import prismadb from "../libs/prismadb";
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
        friend: true,
      },
    });

    if (otherUsers.length === 0) return [];

    return otherUsers;
  } catch (error) {
    return [];
  } finally {
    await prismadb.$disconnect();
  }
}
