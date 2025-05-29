// app/api/bayar-tagihan/route.ts
import { NextResponse } from "next/server"
import { format } from "date-fns"
import { getServerSession } from "next-auth"

import { dbKediri as db } from "@/lib/db"
import { formatPeriode } from "@/lib/formatPeriode"

function compareArrays(a: any[], b: any[]) {
  return JSON.stringify(a.sort()) === JSON.stringify(b.sort())
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { periode, no_pelanggan, kasir, loket } = body

    if (!Array.isArray(periode) || !no_pelanggan) {
      return NextResponse.json(
        { success: false, message: "Data Body Invalid" },
        { status: 400 }
      )
    }

    const [dataLoket] = await db.execute(
      "SELECT kodeloket, loket FROM loket WHERE kodeloket = ?",
      [loket]
    )
    const loketData = (dataLoket as any[])[0]
    if (!loketData) {
      return NextResponse.json(
        { success: false, message: "Loket tidak ditemukan" },
        { status: 422 }
      )
    }

    const [pelangganRow] = await db.execute(
      "SELECT * FROM pelanggan WHERE nosamb = ? LIMIT 1",
      [no_pelanggan]
    )
    const pelanggan = (pelangganRow as any[])[0]
    if (!pelanggan) {
      return NextResponse.json(
        { success: false, message: "Pelanggan Tidak Terdaftar" },
        { status: 404 }
      )
    }

    const [rawTagihanResult]: any = await db.query("CALL infotag_moba(?)", [
      no_pelanggan,
    ])
    const tagihanList = rawTagihanResult[0]

    if (!tagihanList || tagihanList.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tagihan tidak ditemukan" },
        { status: 422 }
      )
    }

    if (
      tagihanList.length !== periode.length ||
      !compareArrays(
        tagihanList.map((t: any) => t.periode),
        periode
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Tagihan tidak valid / data Sudah Lunas" },
        { status: 422 }
      )
    }

    const tglSkrg = format(new Date(), "yyyy-MM-dd HH:mm:ss")

    const conn = await db.getConnection()
    try {
      await conn.beginTransaction()

      for (const tagihan of tagihanList) {
        const kode = `${tagihan.periode}.${tagihan.nosamb}`
        console.log(kode)
        const updateData = {
          loketbayar: loket,
          tglbayar: tglSkrg,
          nolpp: "",
          kasir: kasir,
          ppn: 0,
          persenppn: 0,
          flaglunas: 1,
          flagbatal: 0,
          sudahupload: true,
          dendatunggakan: tagihan.dendatunggakan,
          total: tagihan.total,
          totalloket: tagihan.total,
          jasaloket: 0,
          waktuupdate: tglSkrg,
          loketupdate: loket || "",
          namaloket: loketData.loket || "",
        }

        await conn.execute(
          `UPDATE drd SET
            loketbayar = ?, tglbayar = ?, nolpp = ?, kasir = ?, ppn = ?, persenppn = ?,
            flaglunas = ?, flagbatal = ?, sudahupload = ?, dendatunggakan = ?, total = ?, totalloket = ?,
            jasaloket = ?, waktuupdate = ?, loketupdate = ?, namaloket = ?
           WHERE kode = ?`,
          [
            updateData.loketbayar,
            updateData.tglbayar,
            updateData.nolpp,
            updateData.kasir,
            updateData.ppn,
            updateData.persenppn,
            updateData.flaglunas,
            updateData.flagbatal,
            updateData.sudahupload,
            updateData.dendatunggakan,
            updateData.total,
            updateData.totalloket,
            updateData.jasaloket,
            updateData.waktuupdate,
            updateData.loketupdate,
            updateData.namaloket,
            kode,
          ]
        )
      }

      await conn.commit()
    } catch (err: any) {
      await conn.rollback()
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      )
    } finally {
      conn.release()
    }

    const detailTagihan = tagihanList.map((tagihan: any) => ({
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
      tglbayar: tglSkrg,
    }))

    return NextResponse.json(
      {
        success: true,
        message: "Tagihan berhasil dibayar",
        data: {
          nosamb: pelanggan.nosamb,
          nama: pelanggan.nama.trim(),
          alamat: pelanggan.alamat.trim(),
          kodegol: pelanggan.kodegol,
          status: pelanggan.aktif,
          detail_tagihan: detailTagihan,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error bayar tagihan:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
