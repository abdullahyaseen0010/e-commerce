"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api/user";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import type { Notification } from "@/types/user";

type FilterOption = "all" | "unread";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("We couldn't load your notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      setError("We couldn't update that notification. Please try again.");
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError("We couldn't update your notifications. Please try again.");
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-1 text-gray-600">
            Updates about your orders, wishlist, and account.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={markingAllRead}
          >
            {markingAllRead ? "Marking..." : "Mark All as Read"}
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            filter === "all"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            filter === "unread"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title={filter === "unread" ? "You're all caught up" : "No notifications yet"}
          description={
            filter === "unread"
              ? "You have no unread notifications."
              : "We'll let you know when there's something new."
          }
        />
      ) : (
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {filteredNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              className="flex w-full items-start gap-3 p-4 text-left hover:bg-gray-50"
            >
              <span
                className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                  notification.isRead ? "bg-transparent" : "bg-blue-600"
                }`}
              />
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    notification.isRead
                      ? "font-normal text-gray-700"
                      : "font-medium text-gray-900"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
