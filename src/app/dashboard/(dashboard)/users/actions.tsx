import React, { useState } from "react"

import type { User } from "./columns"

import DeleteModal from "./delete"
import EditUserModal from "./edit"

type Props = { data: User }

const Actions = ({ data }: Props) => {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <EditUserModal
        values={{ ...(data as User), password: "" }}
        isOpen={editOpen}
        setIsOpen={setEditOpen}
      />
      <DeleteModal />
    </div>
  )
}

export default Actions
