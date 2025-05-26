"use client"

import React from "react"
import useSWR from "swr"

import fetcher from "@/lib/fetcher"

import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import CreateUserModal from "./create"

// type Props = {}

const View = () => {
  const { data, error, isLoading } = useSWR("/api/users", fetcher)
  return (
    <div className="p-5 container">
      <div>
        <h1>Dashboard User</h1>
        <CreateUserModal />
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data: {error.message}</p>}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  )
}

export default View
