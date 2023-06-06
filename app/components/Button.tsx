"use client";

import clsx from "clsx";

interface ButtonProps {
  disabled?: boolean;
  secondary?: boolean;
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  danger?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  disabled,
  secondary,
  type,
  onClick,
  danger,
  fullWidth,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={clsx({
        ["rounded-md duration-300 p-2 py-3 bg-sky-600 font-semibold text-base hover:bg-sky-700 text-white focus-visible:outline-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center justify-center"]:
          true,
        ["bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600"]:
          danger,
        ["bg-white hover:bg-neutral-50 text-gray-900"]: secondary,
        ["!w-full"]: fullWidth,
        ["!opacity-50 !cursor-not-allowed"]: disabled,
      })}
    >
      {children}
    </button>
  );
};
