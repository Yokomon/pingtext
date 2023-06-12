"use client";

import clsx from "clsx";
import { BsSearch } from "react-icons/bs";

interface SearchInputProps {
  placeholder?: string;
  id: string;
  fullWidth?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  id,
  fullWidth,
}) => {
  return (
    <div className="relative">
      <BsSearch size={18} className="absolute top-1/4 left-3 text-sky-600" />
      <input
        type="text"
        id={id}
        placeholder={placeholder || "Search..."}
        autoComplete={id}
        className={clsx({
          ["form-input shadow-sm text-gray-500 bg-gray-50 text-sm sm:text-sm focus:outline-none border-0 ring-1 focus:ring-2 focus:ring-sky-600 pl-10 p-2.5 placeholder:text-gray-400 placeholder:font-medium rounded-md"]:
            true,
          ["w-full"]: fullWidth,
        })}
      />
    </div>
  );
};
