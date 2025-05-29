import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"
import type { NextRequest } from "next/server"

import { dbKediri } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const q = req.nextUrl.searchParams.get("q")
    const [rows] = await dbKediri.query<RowDataPacket[]>(
      "SELECT  * FROM pelanggan WHERE nosamb LIKE ? OR nama LIKE ? OR alamat LIKE ? LIMIT 10",
      [`%${q}%`, `%${q}%`, `%${q}%`]
    )
    console.log(rows)
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}
