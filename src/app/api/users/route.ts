import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { getServerSession } from "next-auth"

import type { RowDataPacket } from "mysql2"

import { UserSchema } from "@/schemas/user-schema"

import { dbRekonsiliasi } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const [rows] = await dbRekonsiliasi.query<RowDataPacket[]>(
      "SELECT id, nama, username FROM users"
    )
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}

//create a post method
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
    const parsedData = UserSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json(parsedData.error, { status: 400 })
    }
    const { nama, username, password } = parsedData.data

    const [rows] = await dbRekonsiliasi.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    )
    if (rows.length > 0) {
      return NextResponse.json(
        { status: 409, message: "Username already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    await dbRekonsiliasi.query(
      "INSERT INTO users (nama, username, password) VALUES (?, ?, ?)",
      [nama, username, hashedPassword]
    )

    return NextResponse.json(
      { status: 201, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "User ID is required" },
        { status: 400 }
      )
    }

    await dbRekonsiliasi.query("DELETE FROM users WHERE id = ?", [id])

    return NextResponse.json(
      { status: 200, message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }
    const body = await req.json()
    const parsedData = UserSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json(parsedData.error, { status: 400 })
    }
    const { id, nama, username, password } = parsedData.data

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "User ID is required" },
        { status: 400 }
      )
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    await dbRekonsiliasi.query(
      "UPDATE users SET nama = ?, username = ?, password = ? WHERE id = ?",
      [nama, username, hashedPassword, id]
    )

    return NextResponse.json(
      { status: 200, message: "User updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Error updating user" }, { status: 500 })
  }
}
