"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import CountUp from "react-countup"

import hitungSelisihBulan from "@/lib/selisihPeriode"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/data-table"
import { BarChartDashboard } from "./chart"
import { columns } from "./columns"

interface Dashboard {
  dataRekonBelumVerifikasi: DataRekonBelumVerifikasi[]
  dataTagihanRekon: DataTagihanRekon[]
  statusVerifikasi: StatusVerifikasi[]
}

interface StatusVerifikasi {
  namauser: string
  sudahverifikasi: string
  belumverifikasi: string
}

interface DataTagihanRekon {
  namauser: string
  data: TagihanRekon[]
}

interface DataRekonBelumVerifikasi {
  id: number
  startdate: string
  enddate: string
  user_id: number
  namauser: string
  data: TagihanRekon[]
  flagverifikasi: number
  created_at: string
  updated_at: string
}

export interface TagihanRekon {
  nama: string
  total: number | string
  alamat: string
  periode: string
  golongan: string
  tglbayar: string
  no_pelanggan: number | string
}
const View = () => {
  const [data, setData] = useState<Dashboard>()
  useEffect(() => {
    axios.get("/api/client/kediri/dashboard").then((res) => setData(res.data))
  }, [])

  return (
    <section className="container p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="">Aplikasi Rekonsiliasi </h3>
          <h1 className="text-3xl font-bold">PDAM Kediri</h1>
        </div>
      </div>

      <Separator className="my-5" />

      {data && (
        <div className="flex flex-col gap-5 ">
          <div className="flex gap-5 ">
            <Card className="w-3/12">
              <CardHeader>
                <h3 className="text-sm">Jumlah Rekon Belum Verifikasi</h3>
              </CardHeader>
              <CardContent>
                <CountUp
                  end={data.dataRekonBelumVerifikasi.length}
                  className="text-3xl font-bold"
                />
              </CardContent>
            </Card>
            <Card className="w-3/12">
              <CardHeader>
                <h3 className="text-sm">Total Pelanggan Transaksi</h3>
              </CardHeader>
              <CardContent>
                <CountUp
                  end={data.dataTagihanRekon.reduce(
                    (total, tagihan) => total + tagihan.data.length,
                    0
                  )}
                  className="text-3xl font-bold"
                />
              </CardContent>
            </Card>
            <Card className="w-3/12">
              <CardHeader>
                <h3 className="text-sm">Total Lembar Transaksi</h3>
              </CardHeader>
              <CardContent>
                <CountUp
                  end={data.dataTagihanRekon.reduce(
                    (total, tagihan) =>
                      total +
                      tagihan.data.reduce(
                        (subTotal, item) =>
                          subTotal + hitungSelisihBulan(item.periode),
                        0
                      ),
                    0
                  )}
                  className="text-3xl font-bold"
                />
              </CardContent>
            </Card>
            <Card className="w-3/12">
              <CardHeader>
                <h3 className="text-sm">Total Transaksi</h3>
              </CardHeader>
              <CardContent>
                <CountUp
                  prefix="Rp"
                  end={data.dataTagihanRekon.reduce(
                    (total, tagihan) =>
                      total +
                      tagihan.data.reduce(
                        (subTotal, item) =>
                          subTotal + parseInt(item.total as string),
                        0
                      ),
                    0
                  )}
                  className="text-3xl font-bold"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-5 h-[700px]">
            <div className="w-7/12 h-full">
              <BarChartDashboard
                data={data.dataTagihanRekon.reduce((acc: any, tagihan) => {
                  const kasir = tagihan.namauser
                  const totalLbr = tagihan.data.reduce(
                    (sum, item) => sum + hitungSelisihBulan(item.periode),
                    0
                  )

                  const existing = acc.find((item: any) => item.kasir === kasir)
                  if (existing) {
                    existing.totalLbr += totalLbr
                  } else {
                    acc.push({ kasir, totalLbr })
                  }

                  return acc
                }, [])}
              />
            </div>

            <div className="w-5/12">
              <h3 className="mb-6 font-bold text-center text-lg">
                Data Rekon belum verifikasi
              </h3>
              <DataTable
                columns={columns}
                data={data.dataRekonBelumVerifikasi.flatMap(
                  (data) => data.data
                )}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default View
