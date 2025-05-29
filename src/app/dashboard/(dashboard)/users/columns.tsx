"use client"

import type { ColumnDef } from "@tanstack/react-table"

import Actions from "./actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface User {
  id: number
  username: string
  nama: string
  role: "super_admin" | "admin" | "user"
  client_access?: string[]
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "client_access",
    header: "Client Access",
    cell: ({ row }) => {
      const clientAccess = row.getValue("client_access") as string[] | undefined
      return (
        <div className="flex flex-wrap gap-2">
          {clientAccess
            ? clientAccess?.join(", ")
            : row.original.role === "user"
              ? "Tidak ada akses"
              : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions data={row.original} />,
    size: 150,
  },
]
