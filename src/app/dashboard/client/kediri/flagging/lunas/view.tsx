"use client"

import React, { useState } from "react"
import axios from "axios"
import clsx from "clsx"
import { format } from "date-fns"
import { toast } from "sonner"

import type { Tagihan } from "@/types/tagihan"

import { Badge } from "@/components/ui/badge"
import { ButtonLoading } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ComboboxPelanggan } from "@/components/combobox/pelanggan"
import { DataTable } from "@/components/data-table"
import { DatePicker } from "@/components/datepicker"
import { columns } from "./columns"
import LunasiModal from "./lunasiModal"

const View = () => {
  const [selectedNopel, setSelectedNopel] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [tagihan, setTagihan] = useState<Tagihan>()
  const searchHandler = async () => {
    if (!selectedNopel || selectedNopel === "" || !selectedDate)
      return toast.error("Pelanggan dan tanggal bayar wajib diisi!")
    setIsLoading(true)

    try {
      const tglBayar = format(selectedDate, "yyyy-MM-dd")
      const res = await axios.get(
        `/api/client/kediri/tagihan?nosamb=${selectedNopel}&tglBayar=${tglBayar}`
      )
      setTagihan(res.data.data)
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section className="container p-4">
      <div>
        <h3 className="">PDAM Kediri </h3>
        <h1 className="text-3xl font-bold">Flagging Lunas</h1>
      </div>
      <Separator className="my-5" />
      <div className="flex justify-between">
        <div className="flex gap-3">
          <ComboboxPelanggan onSelect={setSelectedNopel} />
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            placeHolder="Tanggal Bayar"
          />
          <ButtonLoading
            onClick={searchHandler}
            disabled={!selectedNopel || selectedNopel === ""}
            isLoading={isLoading}
          >
            Cek Data
          </ButtonLoading>
        </div>
        {tagihan && (
          <LunasiModal
            no_pelanggan={tagihan?.nosamb}
            onSuccess={() => {
              setTagihan(undefined)
            }}
            periode={tagihan.detail_tagihan.map((tagihan) =>
              tagihan.periode_number.toString()
            )}
          />
        )}
      </div>

      {tagihan && (
        <div className="mt-5">
          <Card className="">
            <CardHeader className="justify-center text-center font-bold text-xl">
              Detail Pelanggan
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-6/12 flex flex-col gap-3">
                <div className="flex justify-between">
                  <h6 className="font-bold">No Pelanggan</h6>
                  <p>{tagihan?.nosamb}</p>
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Nama</h6>
                  <p>{tagihan?.nama}</p>
                </div>
              </div>

              <div className="lg:w-6/12 flex flex-col gap-3">
                <div className="flex justify-between">
                  <h6 className="font-bold">Alamat</h6>
                  <p>{tagihan?.alamat}</p>
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">Status</h6>
                  <p>
                    <Badge
                      className={clsx(
                        parseInt(tagihan.status) === 1
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {parseInt(tagihan?.status) === 1
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" mt-5">
            <CardHeader className="justify-center text-center font-bold text-xl">
              Detail Tagihan
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={tagihan.detail_tagihan} />
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}

export default View
