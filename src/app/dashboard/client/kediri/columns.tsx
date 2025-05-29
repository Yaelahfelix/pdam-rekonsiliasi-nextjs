"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { TagihanRekon } from "./view"

import { formatPeriode } from "@/lib/formatPeriode"
import { formatRupiah } from "@/lib/formatRupiah"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TagihanRekon>[] = [
  {
    accessorKey: "no_pelanggan",
    header: "No Pelanggan",
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => formatPeriode(row.original.periode),
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },

  // {
  //   accessorKey: "golongan",
  //   header: "Golongan",
  // },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatRupiah(row.original.total),
  },
]
