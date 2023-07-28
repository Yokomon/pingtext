"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { FullPingType } from "@/types/PingsType";

interface IProps {
  initialData?: (
    | FullPingType
    | {
        type: string;
        date: string;
      }
  )[];
}

export const ScrollListener: React.FC<IProps> = ({ initialData }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  useEffect(() => {
    // Scroll the view only when authenticated
    if (bodyRef.current && session.status === "authenticated") {
      bodyRef.current.scrollIntoView(true);
    }
  }, [initialData, session]);

  return <div ref={bodyRef} className="pt-8" />;
};
