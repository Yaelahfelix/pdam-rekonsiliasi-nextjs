import { NextResponse } from "next/server"
import { format } from "date-fns"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"

import { dbKediri as db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const periodeSkrg = format(new Date(), "yyyyMM")

    const [dataRekonBelumVerifikasi] = await db.query<RowDataPacket[]>(
      `SELECT 
  *
FROM 
  rekon_mitra 
WHERE 
  DATE_FORMAT(startdate, '%Y%m') = ?
  AND DATE_FORMAT(enddate, '%Y%m') = ? 
  AND flagverifikasi = 0;
`,
      [periodeSkrg, periodeSkrg]
    )

    const [dataTagihanRekon] = await db.query<RowDataPacket[]>(
      `SELECT 
  namauser, 
  data 
FROM 
  rekon_mitra 
WHERE 
  DATE_FORMAT(startdate, '%Y%m') = ?
  AND DATE_FORMAT(enddate, '%Y%m') = ?;
`,
      [periodeSkrg, periodeSkrg]
    )

    const [statusVerifikasi] = await db.query<RowDataPacket[]>(
      `SELECT 
  namauser,
  SUM(flagverifikasi) AS sudahverifikasi,
  SUM(CASE WHEN flagverifikasi = 0 THEN 1 ELSE 0 END) AS belumverifikasi
FROM 
  rekon_mitra
WHERE 
  DATE_FORMAT(startdate, '%Y%m') = ? AND
  DATE_FORMAT(enddate, '%Y%m') = ? 
GROUP BY 
  namauser;
`,
      [periodeSkrg, periodeSkrg]
    )

    return NextResponse.json(
      { dataRekonBelumVerifikasi, dataTagihanRekon, statusVerifikasi },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching dashboard:", error)
    return NextResponse.json(
      { error: "Error fetching dashboard" },
      { status: 500 }
    )
  }
}
