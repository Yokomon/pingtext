import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { TiMessages } from "@react-icons/all-files/ti/TiMessages";
import { FaUserFriends } from "@react-icons/all-files/fa/FaUserFriends";

export const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "pings",
        path: "/pings",
        icon: TiMessages,
        active: pathname === "/pings",
      },
      {
        label: "friends",
        path: "/friends",
        icon: FaUserFriends,
        active: pathname === "/friends",
      },
    ],
    [pathname]
  );

  return routes;
};
