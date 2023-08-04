import { getReadNotifications } from "../actions/getReadNotifications";
import { getCurrentUser } from "../actions/getCurrentUser";
import { getCurrentUserNotifications } from "../actions/getCurrentUserNotifications";
import SideBar from "../components/sidebar/Sidebar";
import { NotificationsList } from "./components/NotificationsList";

interface LayoutProps {
  children?: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const [userNotifications, readNotifications, currentUser] = await Promise.all(
    [getCurrentUserNotifications(), getReadNotifications(), getCurrentUser()]
  );

  return (
    <SideBar>
      <NotificationsList
        unReadNotifications={userNotifications}
        readNotifications={readNotifications}
        currentUser={currentUser}
      />
      {children}
    </SideBar>
  );
}

export default Layout;
