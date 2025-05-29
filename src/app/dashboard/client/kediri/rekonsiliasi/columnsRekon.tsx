"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"

import type { ColumnDef } from "@tanstack/react-table"

import { formatPeriode } from "@/lib/formatPeriode"
import { formatRupiah } from "@/lib/formatRupiah"

export interface RekonMitra {
  nama: string
  total: number
  alamat: string
  periode: string
  golongan: string
  tglbayar: string
  no_pelanggan: number
}

export const columnsRekon: ColumnDef<RekonMitra>[] = [
  {
    accessorKey: "no",
    header: "No",
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },

  {
    accessorKey: "golongan",
    header: "Golongan",
  },
  {
    accessorKey: "no_pelanggan",
    header: "No Pelanggan",
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => formatPeriode(row.getValue("periode")),
  },
  {
    accessorKey: "tglbayar",
    header: "Tanggal Bayar",
    cell: ({ row }) =>
      format(new Date(row.getValue("tglbayar")), "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "total",
    header: "Total Bayar",
    cell: ({ row }) => formatRupiah(row.getValue("total")),
  },
]
