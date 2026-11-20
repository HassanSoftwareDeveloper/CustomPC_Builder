import { request } from "./api";

export function getNotifications(limit = 20) {
  return request(`/notifications?limit=${limit}`);
}

export function markNotificationRead(id) {
  return request(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}
