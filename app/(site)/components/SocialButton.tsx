import clsx from "clsx";
import { IconType } from "@react-icons/all-files";

interface SocialButtonProps {
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "reset" | "button" | "submit";
  socialIcon: IconType;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  onClick,
  fullWidth,
  type,
  socialIcon: SocialIcon,
  children,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx({
        ["flex items-center justify-center duration-300 ring-1 ring-gray-300 ring-offset-1 bg-gray-100 p-2.5 text-gray-600 text-sm sm:text-base rounded-md hover:bg-gray-200 shadow-sm"]:
          true,
        ["w-full"]: fullWidth,
        ["opacity-50 cursor-not-allowed"]: disabled,
      })}
    >
      <SocialIcon className="text-2xl lg:text-3xl" />
      <div className="ml-6 sm:ml-9">{children}</div>
    </button>
  );
};
