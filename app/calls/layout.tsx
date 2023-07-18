import { getAllFriends } from "../actions/getAllFriends";
import { getCurrentUser } from "../actions/getCurrentUser";
import SideBar from "../components/sidebar/Sidebar";
import { CallList } from "./components/CallList";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const friends = await getAllFriends();
  const currentUser = await getCurrentUser();
  return (
    //@ts-expect-error Server component
    <SideBar>
      <CallList friends={friends} currentUser={currentUser} />
      {children}
    </SideBar>
  );
};

export default Layout;
