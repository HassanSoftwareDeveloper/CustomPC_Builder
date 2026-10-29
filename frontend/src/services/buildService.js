import { request } from "./api";

export function checkBuild(parts) {
  const body = {};
  for (const part of parts) {
    body[part.categoryKey] = part.id;
  }
  return request("/builds/check", {
    method: "POST",
    body: JSON.stringify(body),
  });
}