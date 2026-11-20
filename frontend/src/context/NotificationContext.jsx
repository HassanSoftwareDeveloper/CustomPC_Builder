import { useEffect, useState } from "react";
import { NotificationContext } from "./createNotificationContext";
import { useAuth } from "../hooks/useAuth";
import { connectSocket, disconnectSocket, socket } from "../services/socket";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

const EMPTY = { items: [], unreadCount: 0 };

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, setState] = useState({ userId: null, ...EMPTY });

  useEffect(() => {
    if (!userId) return undefined;
    connectSocket();
    return () => disconnectSocket();
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    const load = () =>
      getNotifications()
        .then((data) => {
          if (active)
            setState({
              userId,
              items: data.items,
              unreadCount: data.unreadCount,
            });
        })
        .catch(() => {});

    const onNew = (notification) => {
      setState((previous) => {
        if (previous.userId !== userId) return previous;
        return {
          ...previous,
          items: [
            notification,
            ...previous.items.filter((item) => item.id !== notification.id),
          ].slice(0, 30),
          unreadCount: previous.unreadCount + 1,
        };
      });
    };

    load();
    socket.on("notification:new", onNew);
    socket.on("connect", load);

    return () => {
      active = false;
      socket.off("notification:new", onNew);
      socket.off("connect", load);
    };
  }, [userId]);

  const current = state.userId === userId ? state : EMPTY;

  const markRead = (id) => {
    setState((previous) => {
      const target = previous.items.find((item) => item.id === id);
      if (!target || target.read) return previous;
      return {
        ...previous,
        items: previous.items.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
        unreadCount: Math.max(previous.unreadCount - 1, 0),
      };
    });
    markNotificationRead(id).catch(() => {});
  };

  const markAllRead = () => {
    setState((previous) => ({
      ...previous,
      items: previous.items.map((item) => ({ ...item, read: true })),
      unreadCount: 0,
    }));
    markAllNotificationsRead().catch(() => {});
  };

  return (
    <NotificationContext.Provider
      value={{
        items: current.items,
        unreadCount: current.unreadCount,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
