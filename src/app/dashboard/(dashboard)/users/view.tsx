"use client"

import React from "react"
import useSWR from "swr"

import fetcher from "@/lib/fetcher"

import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import CreateUserModal from "./create"

// type Props = {}

const View = () => {
  const { data, error, isLoading } = useSWR("/api/users", fetcher)
  console.log(data)
  return (
    <div className="p-5 container">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Dashboard User</h1>
        <CreateUserModal />
      </div>
      <Separator className="my-5" />

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data: {error.message}</p>}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  )
}

export default View
