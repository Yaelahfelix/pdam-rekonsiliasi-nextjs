import React from "react"
import { redirect } from "next/navigation"
import { authOptions } from "@/config/next-auth"
import { getServerSession } from "next-auth"

import View from "./view"

const UserPage = async () => {
  const session = await getServerSession(authOptions)
  if (
    session?.user?.role !== "admin" &&
    session?.user?.role !== "super_admin"
  ) {
    redirect("/dashboard")
  }
  return <View />
}

export default UserPage
