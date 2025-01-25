"use server";

import {cookies} from "next/headers";
import {LAST_PROJECT_ID_COOKIE_NAME, SESSION_COOKIE_NAME} from "@/lib/cookieNames";
import {redirect} from "next/navigation";
import {apiClient} from "@workspace/server/client";

export async function authenticate() {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE_NAME)

  if (!token) {
    redirect(`/login`)
    return
  }

  const auth = await apiClient.users.identity({}, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (auth.user) {
    const lastProjectId = c.get(LAST_PROJECT_ID_COOKIE_NAME)

    const projects = auth.user.projects || []
    const project = projects.find((x) => x.id === lastProjectId?.value) || projects[0]

    if (project) {
      redirect(`/${project.id}`)
    } else {
      redirect(`/new`)
    }
  } else {
    redirect(`/login`)
  }
}