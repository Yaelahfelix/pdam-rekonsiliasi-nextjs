import React from "react"
import { cookies } from "next/headers"
import axios from "axios"

import View from "./view"

const RekonsiliasiKediri = async () => {
  const cookieStore = cookies()
  const res = await axios.get(
    `${process.env.BASE_URL}/api/client/kediri/kasir`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  )
  return <View kasir={res.data} />
}

export default RekonsiliasiKediri
