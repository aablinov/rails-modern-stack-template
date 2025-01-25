import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import "styles/prose.css"
import AppProviders from "@/components/Providers/AppProviders";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
