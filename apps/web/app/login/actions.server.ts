"use server";

import {cookies} from "next/headers";
import {SESSION_COOKIE_NAME} from "@/lib/cookieNames";
import {apiClient} from "@workspace/server/client";

async function signInWithAuthCode(auth_code: string) {
  const response = await apiClient.auth.sign_in_with_auth_code({auth_code});

  if (!response.error) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, response.access_token);
  }

  return response;
}

export {signInWithAuthCode};
