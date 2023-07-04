import { getReadNotifications } from "../actions/getReadNotifications";
import { getCurrentUser } from "../actions/getCurrentUser";
import { getCurrentUserNotifications } from "../actions/getCurrentUserNotifications";
import SideBar from "../components/sidebar/Sidebar";
import { NotificationsList } from "./components/NotificationsList";

interface LayoutProps {
  children?: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const userNotifications = await getCurrentUserNotifications();
  const readNotifications = await getReadNotifications();
  const currentUser = await getCurrentUser();

  return (
    // @ts-ignore Server component
    <SideBar>
      <NotificationsList
        unReadNotifications={userNotifications}
        readNotifications={readNotifications}
        currentUser={currentUser!}
      />
      {children}
    </SideBar>
  );
}

export default Layout;
