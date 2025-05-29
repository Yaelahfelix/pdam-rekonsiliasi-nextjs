import { redirect } from "next/navigation"
import { authOptions } from "@/config/next-auth"
import { getServerSession } from "next-auth"

import { clientKEDIRINavigationsData } from "@/data/navigations"

import { Layout } from "@/components/layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (
    session?.user.role === "user" &&
    session?.user.client_access?.includes("kediri") === false
  ) {
    redirect("/dashboard")
  }
  return (
    <Layout navigationsData={clientKEDIRINavigationsData}>{children}</Layout>
  )
}
