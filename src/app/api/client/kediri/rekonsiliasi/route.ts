import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"

import { dbKediri } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const body = await req.json()
    if (!body.tgl1 || !body.tgl2 || !body.kasir) {
      return NextResponse.json(
        { status: 400, message: "Req body is missing" },
        { status: 400 }
      )
    }
    const [rows] = await dbKediri.query<RowDataPacket[]>(
      "SELECT * FROM rekon_mitra WHERE startdate = ? AND enddate = ? AND namauser = ?",
      [body.tgl1, body.tgl2, body.kasir]
    )

    const [rows2] = await dbKediri.query<RowDataPacket[]>(
      "SELECT periode, nosamb, nama, alamat, kodegol, total FROM drd WHERE flaglunas = 1 AND tglbayar BETWEEN ? AND ? AND kasir = ?",
      [body.tgl1, body.tgl2, body.kasir]
    )

    return NextResponse.json({ rekonmitra: rows, drd: rows2 }, { status: 200 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}
