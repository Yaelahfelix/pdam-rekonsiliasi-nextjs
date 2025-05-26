import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import type { RowDataPacket } from "mysql2"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { dbRekonsiliasi } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  const parsedData = SignInSchema.safeParse(body)

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { username, password } = parsedData.data

  try {
    const [row] = await dbRekonsiliasi.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    )
    const userData = row[0]
    if (!userData) {
      return NextResponse.json(
        { message: "Invalid email or password", email: username },
        { status: 401 }
      )
    }
    const isPasswordMatch = await bcrypt.compare(password, userData.password)

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        id: userData.id,
        nama: userData.nama,
        username: userData.username,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error("Error signing in:", e)
    return NextResponse.json({ error: "Error signing in" }, { status: 500 })
  }
}
