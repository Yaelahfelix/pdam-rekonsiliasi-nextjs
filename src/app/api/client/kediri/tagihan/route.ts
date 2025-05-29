// app/api/cek-tagihan/route.ts
import { NextResponse } from "next/server"
import { authOptions } from "@/config/next-auth"
import { format, subMonths } from "date-fns"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"

import { dbKediri } from "@/lib/db"
import { formatPeriode } from "@/lib/formatPeriode"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const nosamb = searchParams.get("nosamb")
    const tglBayar = searchParams.get("tglBayar")

    if (!nosamb || !tglBayar) {
      return NextResponse.json(
        { success: false, message: "nosamb dan tglbayar wajib diisi" },
        { status: 400 }
      )
    }

    const datemin = format(subMonths(new Date(), 3), "yyyyMM")

    const [pelanggan] = await dbKediri.query<RowDataPacket[]>(
      "SELECT * FROM pelanggan WHERE nosamb = ? LIMIT 1",
      [nosamb]
    )

    if (!pelanggan.length) {
      return NextResponse.json(
        { success: false, message: "Pelanggan Tidak Terdaftar" },
        { status: 404 }
      )
    }

    const [[tagihanBlmLunas]] = await dbKediri.query<RowDataPacket[]>(
      "CALL infotag_flagging(?,?)",
      [nosamb, tglBayar]
    )

    if (!tagihanBlmLunas.length) {
      return NextResponse.json(
        { success: false, message: "Tidak Ada Data Tagihan" },
        { status: 422 }
      )
    }

    const periodeLast = tagihanBlmLunas[tagihanBlmLunas.length - 1]

    if (Number(periodeLast.periode) < Number(datemin)) {
      return NextResponse.json(
        {
          success: false,
          message: "Pelanggan Harus Bayar Dikantor PDAM",
        },
        { status: 404 }
      )
    }

    const detailTagihan = tagihanBlmLunas.map((tagihan: any) => ({
      periode: formatPeriode(tagihan.periode),
      periode_number: Number(tagihan.periode),
      kodegol: tagihan.kodegol,
      stanlalu: Number(tagihan.stanlalu),
      stanskrg: Number(tagihan.stanskrg),
      stanangkat: Number(tagihan.stanangkat),
      pakai: Number(tagihan.pakai),
      biayapemakaian: Number(tagihan.biayapemakaian),
      denda: Number(tagihan.dendatunggakan),
      administrasi: Number(tagihan.administrasi),
      retribusi: Number(tagihan.retribusi),
      pemeliharaan: Number(tagihan.pemeliharaan),
      pelayanan: Number(tagihan.pelayanan),
      angsuran: Number(tagihan.angsuran),
      materai: Number(tagihan.meterai),
      ppn: Number(tagihan.ppn),
      total: Number(tagihan.total),
    }))

    return NextResponse.json(
      {
        success: true,
        message: "Data Tagihan Tersedia",
        data: {
          nosamb: pelanggan[0].nosamb,
          nama: pelanggan[0].nama.trim(),
          alamat: pelanggan[0].alamat.trim(),
          kodegol: pelanggan[0].kodegol,
          status: pelanggan[0].aktif,
          detail_tagihan: detailTagihan,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
