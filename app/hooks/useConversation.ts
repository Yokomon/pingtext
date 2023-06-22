import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params.pingId) {
      return "";
    }
    return params.pingId as string;
  }, [params]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return [isOpen, conversationId];
};
