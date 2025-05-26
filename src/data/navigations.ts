import type { NavigationType } from "@/types"

export const navigationsData: NavigationType[] = [
  {
    title: "Main",
    items: [
      {
        id: "home",
        title: "Home",
        href: "/dashboard",
        iconName: "House",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        id: "users",
        title: "Users",
        href: "/dashboard/users",
        iconName: "Users",
        role: ["admin", "superadmin"],
      },
    ],
  },
]

export const clientKEDIRINavigationsData: NavigationType[] = [
  {
    title: "Main",
    items: [
      {
        id: "rekonsiliasi",
        title: "Rekonsiliasi",
        href: "/dashboard/client/kediri/rekonsiliasi",
        iconName: "House",
      },
      {
        id: "flagging",
        title: "Flagging",
        href: "/dashboard/client/kediri/flagging",
        iconName: "Flag",
      },
      {
        id: "laporan",
        title: "Laporan",
        href: "/dashboard/client/kediri/laporan",
        iconName: "FileText",
      },
    ],
  },
]

export const clientPROBOLINGGONavigationsData: NavigationType[] = [
  {
    title: "Main",
    items: [
      {
        id: "rekonsiliasi",
        title: "Rekonsiliasi",
        href: "/dashboard/client/probolinggo/rekonsiliasi",
        iconName: "House",
      },
      {
        id: "flagging",
        title: "Flagging",
        href: "/dashboard/client/probolinggo/flagging",
        iconName: "Flag",
      },
      {
        id: "laporan",
        title: "Laporan",
        href: "/dashboard/client/probolinggo/laporan",
        iconName: "FileText",
      },
    ],
  },
]

export const clientNGANJUKNavigationsData: NavigationType[] = [
  {
    title: "Main",
    items: [
      {
        id: "rekonsiliasi",
        title: "Rekonsiliasi",
        href: "/dashboard/client/nganjuk/rekonsiliasi",
        iconName: "House",
      },
      {
        id: "flagging",
        title: "Flagging",
        href: "/dashboard/client/nganjuk/flagging",
        iconName: "Flag",
      },
      {
        id: "laporan",
        title: "Laporan",
        href: "/dashboard/client/nganjuk/laporan",
        iconName: "FileText",
      },
    ],
  },
]
