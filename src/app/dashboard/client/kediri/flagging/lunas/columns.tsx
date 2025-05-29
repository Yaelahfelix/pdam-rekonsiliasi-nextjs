"use client"

import type { Detailtagihan } from "@/types/tagihan"
import type { ColumnDef } from "@tanstack/react-table"

import { formatRupiah } from "@/lib/formatRupiah"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Detailtagihan>[] = [
  {
    accessorKey: "periode",
    header: "Periode",
  },
  {
    accessorKey: "kodegol",
    header: "Kode Gol",
  },
  {
    accessorKey: "stanskrg",
    header: "Stan Skrg",
  },

  {
    accessorKey: "stanlalu",
    header: "Stan Lalu",
  },

  {
    accessorKey: "pakai",
    header: "Pakai",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatRupiah(row.original.total),
  },
]
