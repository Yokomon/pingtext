import { getAllNotifications } from "../actions/getAllNotifications";
import SideBar from "../components/sidebar/Sidebar";
import { NotificationsList } from "./components/NotificationsList";

interface LayoutProps {
  children?: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const unReadNotifications = await getAllNotifications("unread");
  const readNotifications = await getAllNotifications("read");

  return (
    // @ts-expect-error Server component
    <SideBar>
      <NotificationsList
        unReadNotifications={unReadNotifications}
        readNotifications={readNotifications}
      />
      {children}
    </SideBar>
  );
}

export default Layout;
