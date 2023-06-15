import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { TiMessages } from "@react-icons/all-files/ti/TiMessages";
import { FaUserFriends } from "@react-icons/all-files/fa/FaUserFriends";
import { IoMdCall } from "@react-icons/all-files/io/IoMdCall";

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
      {
        label: "calls",
        path: "/calls",
        icon: IoMdCall,
        active: pathname === "/calls",
      },
    ],
    [pathname]
  );

  return routes;
};
