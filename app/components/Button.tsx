"use client";

import clsx from "clsx";
import { ImSpinner10 } from "react-icons/im";

interface ButtonProps {
  disabled?: boolean;
  secondary?: boolean;
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  danger?: boolean;
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  disabled,
  secondary,
  type,
  onClick,
  danger,
  fullWidth,
  children,
  isLoading,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={clsx({
        ["relative rounded-md duration-300 p-2 py-3 text-sm sm:text-base bg-sky-600 font-semibold hover:bg-sky-700 text-white focus-visible:outline-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center justify-center"]:
          true,
        ["bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600"]:
          danger,
        ["bg-white hover:bg-neutral-50 text-gray-900"]: secondary,
        ["!w-full"]: fullWidth,
        ["opacity-50 cursor-not-allowed"]: disabled,
      })}
    >
      {children}
      {isLoading && (
        <ImSpinner10 className="motion-safe:animate-spin text-xl sm:text-2xl ml-8" />
      )}
    </button>
  );
};
