"use client";

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {ScopeProvider} from "@/contexts/scope";
import {useState} from "react";

export default function AppProviders({ children }: { children: React.ReactNode }) {

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
        <ScopeProvider>
          {children}
        </ScopeProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
