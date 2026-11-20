import { useContext } from "react";
import { NotificationContext } from "../context/createNotificationContext";

export function useNotifications() {
  return useContext(NotificationContext);
}
