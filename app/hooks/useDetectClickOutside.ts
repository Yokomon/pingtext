import { useEffect, useRef, useState } from "react";

export default function useDetectClickOutside(initState: boolean) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [show, setShow] = useState<boolean>(initState);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        triggerRef.current.contains(event.target as Node)
      ) {
        return setShow(!show);
      }

      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        return setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [show]);

  return {
    triggerRef,
    nodeRef,
    show,
    setShow,
  };
}
