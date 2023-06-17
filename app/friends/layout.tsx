import { getAllFriends } from "../actions/getAllFriends";
import { getCurrentUser } from "../actions/getCurrentUser";
import getOtherUsers from "../actions/getOtherUsers";
import SideBar from "../components/sidebar/Sidebar";
import { FriendsList } from "./components/FriendsList";

interface LayoutProps {
  children?: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const userFriends = await getAllFriends();
  const otherUsers = await getOtherUsers();
  const currentUser = await getCurrentUser();
  return (
    //@ts-expect-error Server component
    <SideBar>
      <FriendsList
        userFriends={userFriends!}
        otherUsers={otherUsers}
        currentUser={currentUser!}
      />
      {children}
    </SideBar>
  );
}

export default Layout;
