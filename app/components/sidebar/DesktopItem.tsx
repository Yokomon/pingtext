"use client";

import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface DesktopItemProps {
  label: string;
  path: string;
  icon: IconType;
  active: boolean;
  onClick?: () => void;
}

export const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  path,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) return onClick;
  };
  return (
    <li
      onClick={handleClick}
      className={clsx({
        ["hover:bg-sky-50 p-3 cursor-pointer rounded-sm duration-300"]: true,
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
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};
