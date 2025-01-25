"use client";

import * as React from "react"
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import FullPageLoading from "@/components/FullPageLoading";
import {useEffect} from "react";
import {redirect} from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useGetCurrentUser()

  useEffect(() => {
    if (auth.error) {
      redirect('/login')
    }
  }, [auth.error, auth.isLoading]);

  if (auth.isLoading) {
    return <FullPageLoading />;
  }

  return <>{children}</>
}
