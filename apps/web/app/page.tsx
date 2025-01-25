"use server";

import {authenticate} from "@/app/actions/authenticate.server";

export default async function IndexPage() {
  await authenticate()
}