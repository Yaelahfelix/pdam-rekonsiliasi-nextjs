"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// type Props = {}

const View = () => {
  const [client, setClient] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const Router = useRouter()
  const session = useSession()
  const user = session.data?.user
  const role = user?.role
  const isAdmin = role === "admin" || role === "super_admin"
  const ClientAccess = user?.client_access
  const clientHandler = async () => {
    setIsLoading(true)
    if (client === "kediri") {
      Router.push("/dashboard/client/kediri")
    } else if (client === "probolinggo") {
      Router.push("/dashboard/client/probolinggo")
    } else if (client === "nganjuk") {
      Router.push("/dashboard/client/nganjuk")
    } else {
      setIsLoading(false)
    }
  }
  return (
    <section className="container p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="">Selamat datang di Aplikasi </h3>
          <h1 className="text-3xl font-bold">Rekonsiliasi PDAM</h1>
        </div>
        <Card className="w-4/12 p-5">
          <CardHeader>
            Akses Client
            <CardDescription>Pilih client untuk masuk aplikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setClient} defaultValue={client}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Client" />
              </SelectTrigger>
              <SelectContent>
                {isAdmin || ClientAccess?.includes("kediri") ? (
                  <SelectItem value="kediri">PDAM Kota Kediri</SelectItem>
                ) : null}
                {isAdmin || ClientAccess?.includes("probolinggo") ? (
                  <SelectItem value="probolinggo">
                    PDAM Kota Probolinggo
                  </SelectItem>
                ) : null}
                {isAdmin || ClientAccess?.includes("nganjuk") ? (
                  <SelectItem value="nganjuk">PDAM Kota Nganjuk</SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <Button
              disabled={!client || isLoading}
              className="w-full"
              onClick={clientHandler}
            >
              Masuk
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default View
