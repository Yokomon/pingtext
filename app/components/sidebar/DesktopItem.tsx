"use client";

import clsx from "clsx";
import Link from "next/link";
import { IconType } from "@react-icons/all-files";
import { Notification } from "@prisma/client";

interface DesktopItemProps {
  label: string;
  path: string;
  icon: IconType;
  active?: boolean;
  notifications?: Notification[];
  onClick?: () => void;
}

export const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  path,
  icon: Icon,
  active,
  onClick,
  notifications,
}) => {
  const handleClick = () => {
    if (onClick) return onClick;
  };
  return (
    <li
      onClick={handleClick}
      className={clsx({
        ["hover:bg-sky-50 p-3 rounded-sm duration-300 relative"]: true,
        ["bg-sky-50"]: active,
      })}
    >
      <Link
        href={path}
        className={clsx({
          ["focus:outline-none text-gray-400 hover:text-sky-600 duration-300"]:
            true,
          ["!text-sky-600"]: active,
        })}
      >
        <Icon size={25} />
        {!!notifications?.length && (
          <span className="text-[10px] rounded-full p-1.5 h-4 w-fit flex items-center text-white absolute top-2 right-0 bg-rose-600">
            {notifications.length}
          </span>
        )}
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};
