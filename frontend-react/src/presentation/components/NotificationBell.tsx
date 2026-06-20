import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../application/notification/useNotificationStore";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAllRead = useNotificationStore((state) => state.markAllRead);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) markAllRead();
      return next;
    });
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <Bell size={20} className="text-neutral-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 max-h-80 overflow-y-auto">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-700">
              Notifications
            </p>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-400 text-center">
              Aucune notification pour le moment.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {notifications.map((notification) => (
                <li key={notification.id} className="px-4 py-3">
                  <p className="text-sm text-neutral-700">
                    {notification.message}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(notification.receivedAt).toLocaleTimeString(
                      "fr-FR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
