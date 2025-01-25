"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Trash2,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {useScope} from "@/contexts/scope";
import {usePathname} from "next/navigation";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const auth = useGetCurrentUser();
  const {scope} = useScope();

  const pathname = usePathname()

  const navMain = [
    {
      title: "Search",
      url: `/${scope}/search`,
      icon: Search,
      isActive: pathname === `/${scope}/search`,
    },
    {
      title: "Home",
      url: `/${scope}`,
      icon: Home,
      isActive: pathname === `/${scope}`,
    },
  ];

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        {!auth.isLoading && auth.user && <TeamSwitcher teams={auth.user.projects.map((x) => {
          return {
            id: x.id,
            name: x.name,
            logo: Command,
            plan: 'Enterprise',
          }
        })} />}
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
