import { FullPingType } from "@/types/PingsType";

export interface PusherConversation {
  conversationId?: string;
  newPing: FullPingType;
}
