"use client"

import React, { useState } from "react"
import axios from "axios"
import { addDays, format } from "date-fns"
import { toast } from "sonner"

import type { DateRange } from "react-day-picker"
import type { DRD } from "./columnsDrd"
import type { RekonMitra } from "./columnsRekon"

import { Button, ButtonLoading } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/data-table"
import { DatePickerWithRange } from "@/components/daterange-picker"
import { columnsDRD } from "./columnsDrd"
import { columnsRekon } from "./columnsRekon"
import ExcelExporter from "./exportExcel"

type Props = { kasir: { id: number; nama: string; namauser: string }[] }

const View = ({ kasir }: Props) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [selectedKasir, setSelectedKasir] = useState("")
  const [rekonId, setRekonId] = useState<number[]>()
  const [dataRekon, setDataRekon] = useState<RekonMitra[]>([])
  const [dataDrd, setdataDrd] = useState<DRD[]>([])
  const [loading, setLoading] = useState(false)

  const onSearch = async () => {
    if (!date || !selectedKasir || !date.from || !date.to) return
    setDataRekon([])
    setdataDrd([])
    setRekonId([])
    setLoading(true)
    const res = await axios.post(`/api/client/kediri/rekonsiliasi`, {
      tgl1: format(date.from, "yyyy-MM-dd"),
      tgl2: format(date.to, "yyyy-MM-dd"),
      kasir: selectedKasir,
    })
    if (res.status === 200) {
      console.log(res.data)
      setRekonId(res.data.rekonmitra.map((item: any) => item.id))
      setDataRekon(res.data.rekonmitra.flatMap((item: any) => item.data))
      setdataDrd(res.data.drd)
    } else {
      toast.error("Gagal mengambil data rekonsiliasi")
    }
    setLoading(false)
  }

  const verifikasiHandler = async () => {
    const totalRekon = dataRekon.reduce((acc, item) => acc + item.total, 0)
    const totalDrd = dataDrd.reduce(
      (acc, item) => acc + parseFloat(item.total),
      0
    )
    if (totalRekon !== totalDrd) {
      toast.error("Total Rekonsiliasi tidak sesuai dengan Total DRD")
      return
    }
    const res = await axios.post(`/api/client/kediri/rekonsiliasi/verifikasi`, {
      rekonsiliasiId: rekonId,
    })
    if (res.status === 200) {
      toast.success("Rekonsiliasi berhasil diverifikasi")
      setDataRekon([])
      setdataDrd([])
      setRekonId([])
    } else {
      toast.error("Gagal verifikasi rekonsiliasi")
    }
  }
  return (
    <section className="container p-4">
      <div>
        <h3 className="">PDAM Kediri </h3>
        <h1 className="text-3xl font-bold">Rekonsiliasi</h1>
      </div>
      <Separator className="my-5" />
      <div className="flex justify-between">
        <div className="flex gap-5">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Select onValueChange={setSelectedKasir} value={selectedKasir}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kasir" />
            </SelectTrigger>
            <SelectContent>
              {kasir.map((item) => (
                <SelectItem key={item.id} value={item.nama}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ButtonLoading
            isLoading={loading}
            disabled={selectedKasir === ""}
            onClick={onSearch}
          >
            Cari Data
          </ButtonLoading>
        </div>
        {dataRekon.length > 0 && dataDrd.length > 0 && (
          <div className="flex gap-5">
            <ExcelExporter data={{ drd: dataDrd, rekonmitra: dataRekon }} />
            <Button
              onClick={verifikasiHandler}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Verifikasi
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-5 mt-5">
        <div className="w-6/12">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Data Rekonsiliasi
          </h2>
          <div className="flex justify-between items-center mb-3">
            <h1>Total</h1>
            <p className="text-2xl font-bold">
              {dataRekon
                .reduce((acc, item) => acc + parseInt(item.total as any), 0)
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
            </p>
          </div>
          <DataTable columns={columnsRekon} data={dataRekon} />
        </div>
        <div className="w-6/12">
          <h2 className="text-2xl font-bold mb-3 text-center">Data DRD</h2>
          <div className="flex justify-between items-center mb-3">
            <h1>Total</h1>
            <p className="text-2xl font-bold">
              {dataDrd
                .reduce((acc, item) => acc + parseFloat(item.total), 0)
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
            </p>
          </div>
          <DataTable columns={columnsDRD} data={dataDrd} />
        </div>
      </div>
    </section>
  )
}

export default View
