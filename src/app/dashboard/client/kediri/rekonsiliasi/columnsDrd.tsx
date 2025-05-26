"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatPeriode } from "@/lib/formatPeriode"
import { formatRupiah } from "@/lib/formatRupiah"

export interface DRD {
  periode: string
  nosamb: string
  nama: string
  alamat: string
  kodegol: string
  total: string
}

export const columnsDRD: ColumnDef<DRD>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
  },
  {
    accessorKey: "kodegol",
    header: "Golongan",
  },
  {
    accessorKey: "nosamb",
    header: "No Pelanggan",
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => formatPeriode(row.getValue("periode")),
  },

  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatRupiah(row.getValue("total")),
  },
]
