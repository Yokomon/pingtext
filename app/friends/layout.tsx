import { getAllFriends } from "../actions/getAllFriends";
import getOtherUsers from "../actions/getOtherUsers";
import SideBar from "../components/sidebar/Sidebar";
import { FriendsList } from "./components/FriendsList";

interface LayoutProps {
  children?: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const userFriends = await getAllFriends();
  const otherUsers = await getOtherUsers();
  return (
    <SideBar>
      <FriendsList userFriends={userFriends!} otherUsers={otherUsers} />
      {children}
    </SideBar>
  );
}

export default Layout;
