// components/ExcelExporter.js
import { useState } from "react"
import * as XLSX from "xlsx"

import type { DRD } from "./columnsDrd"
import type { RekonMitra } from "./columnsRekon"

import { formatRupiah } from "@/lib/formatRupiah"

import { Button } from "@/components/ui/button"

const ExcelExporter = ({
  data,
}: {
  data: {
    rekonmitra: RekonMitra[]
    drd: DRD[]
  }
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const exportToExcel = (): void => {
    setIsExporting(true)

    try {
      const workbook = XLSX.utils.book_new()

      if (data.rekonmitra && data.rekonmitra.length > 0) {
        const rekonMitraData = data.rekonmitra.map((item: RekonMitra) => ({
          "No Pelanggan": item.no_pelanggan,
          Nama: item.nama,
          Alamat: item.alamat,
          Periode: item.periode,
          Golongan: item.golongan || "-",
          "Tanggal Bayar": item.tglbayar,
          Total: formatRupiah(item.total),
        }))

        const rekonMitraWS = XLSX.utils.json_to_sheet(rekonMitraData)

        rekonMitraWS["!cols"] = [
          { wch: 15 }, // No Pelanggan
          { wch: 30 }, // Nama
          { wch: 40 }, // Alamat
          { wch: 10 }, // Periode
          { wch: 12 }, // Golongan
          { wch: 15 }, // Tanggal Bayar
          { wch: 18 }, // Total
        ]
        // const range = XLSX.utils.decode_range(rekonMitraWS["!ref"] || "A1")
        rekonMitraWS["!autofilter"] = { ref: rekonMitraWS["!ref"] || "A1" }

        XLSX.utils.book_append_sheet(workbook, rekonMitraWS, "Rekon Mitra")
      }

      if (data.drd && data.drd.length > 0) {
        const drdData = data.drd.map((item: DRD) => ({
          Periode: item.periode,
          "No Sambungan": item.nosamb,
          Nama: item.nama.trim(),
          Alamat: item.alamat.trim(),
          "Kode Golongan": item.kodegol,
          Total: parseFloat(item.total).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }),
        }))

        const drdWS = XLSX.utils.json_to_sheet(drdData)

        drdWS["!cols"] = [
          { wch: 10 }, // Periode
          { wch: 15 }, // No Sambungan
          { wch: 35 }, // Nama
          { wch: 40 }, // Alamat
          { wch: 12 }, // Kode Golongan
          { wch: 18 }, // Total
        ]

        drdWS["!autofilter"] = { ref: drdWS["!ref"] || "A1" }

        XLSX.utils.book_append_sheet(workbook, drdWS, "DRD")
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `rekon_mitra_export_${timestamp}.xlsx`

      XLSX.writeFile(workbook, filename)

      console.log("Excel file exported successfully!")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Terjadi kesalahan saat export ke Excel")
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <Button onClick={exportToExcel} disabled={isExporting}>
      {isExporting ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exporting...
        </span>
      ) : (
        "📊 Export to Excel"
      )}
    </Button>
  )
}

export default ExcelExporter
