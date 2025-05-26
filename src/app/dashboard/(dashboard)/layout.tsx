import { navigationsData } from "@/data/navigations"

import { Layout } from "@/components/layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout navigationsData={navigationsData}>{children}</Layout>
}
