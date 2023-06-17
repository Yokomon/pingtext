"use client";

import clsx from "clsx";
import { ImSpinner10 } from "@react-icons/all-files/im/ImSpinner10";

interface ButtonProps {
  disabled?: boolean;
  secondary?: boolean;
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  danger?: boolean;
  isLoading?: boolean;
  className?: string;
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
  className,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={clsx({
        ["relative rounded-md duration-300 p-2 py-3 text-sm sm:text-base bg-sky-600 font-semibold hover:bg-sky-700 text-white focus-visible:outline-sky-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 flex items-center justify-center"]:
          true,
        ["!bg-rose-500 hover:!bg-rose-600 !text-white focus-visible:!outline-rose-600"]:
          danger,
        ["!bg-gray-300 hover:!bg-gray-400 hover:!text-white !text-gray-600 focus-visible:!outline-gray-600 focus-visible:!outline focus-visible:!outline-1 focus-visible:!outline-offset-2"]:
          secondary,
        ["!w-full"]: fullWidth,
        ["!opacity-50 !cursor-not-allowed"]: disabled,
        [className as string]: className,
      })}
    >
      {children}
      {isLoading && (
        <ImSpinner10 className="motion-safe:animate-spin text-xl sm:text-2xl ml-4" />
      )}
    </button>
  );
};
