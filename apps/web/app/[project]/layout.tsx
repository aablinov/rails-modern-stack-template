import AuthProvider from "@/components/Providers/AuthProvider";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@workspace/ui/components/sidebar";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}