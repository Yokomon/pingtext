import { getAllFriends } from "../actions/getAllFriends";
import SideBar from "../components/sidebar/Sidebar";
import { CallList } from "./components/CallList";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const friends = await getAllFriends();
  return (
    <SideBar>
      <CallList friends={friends} />
      {children}
    </SideBar>
  );
};

export default Layout;
