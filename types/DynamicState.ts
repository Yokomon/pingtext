import { User } from "@prisma/client";
import React from "react";

export interface DynamicStateType {
  user: null | User;
  recipientId?: string;
  notificationId?: string
  message: string;
}
