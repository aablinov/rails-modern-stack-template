import {Api} from "@workspace/server/types";

export const apiClient = new Api({
  baseUrl: "http://localhost:3001/api/v1/",
  baseApiParams: {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    format: "json",
  }
});