"use client"

import type { NavigationType } from "@/types"
import type { ReactNode } from "react"

import { VerticalLayout } from "./vertical-layout"

export function Layout({
  children,
  navigationsData,
}: {
  children: ReactNode
  navigationsData: NavigationType[]
}) {
  return (
    <VerticalLayout navigationsData={navigationsData}>
      {children}
    </VerticalLayout>
  )
}
