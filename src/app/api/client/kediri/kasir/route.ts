import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"

import { dbKediri } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const [rows] = await dbKediri.query<RowDataPacket[]>(
      "SELECT id, nama FROM userakses"
    )
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}
