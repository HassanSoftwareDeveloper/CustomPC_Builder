import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

const formatTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

function NotificationBell({ align = "right" }) {
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openNotification = (notification) => {
    markRead(notification.id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white/75 text-ink transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-white shadow-xl shadow-ink/10 ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <p className="text-sm font-black text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-bold text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              No notifications yet.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-border/70 overflow-y-auto">
              {items.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-bg ${
                      notification.read ? "" : "bg-primary/5"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        notification.read ? "bg-transparent" : "bg-primary"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink">
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {notification.message}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted/80">
                        {formatTime(notification.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
