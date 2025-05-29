"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import { ButtonLoading } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LunasiModal = ({
  periode,
  no_pelanggan,
  onSuccess,
}: {
  periode: string[]
  no_pelanggan: string
  onSuccess: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKasir, setSelectedKasir] = useState("")

  const [kasir, setKasir] = useState<
    {
      id: number
      nama: string
      kodeloket: string
    }[]
  >([])
  useEffect(() => {
    axios.get("/api/client/kediri/kasir").then((res) => {
      setKasir(res.data)
    })
  }, [])

  const lunasiHandler = async () => {
    if (!selectedKasir) return toast.error("Kasir harus dipilih!")

    setIsLoading(true)
    const dataKasir = kasir.find((val) => val.id === parseInt(selectedKasir))
    try {
      await axios.post("/api/client/kediri/tagihan/lunasi", {
        periode,
        no_pelanggan,
        kasir: dataKasir?.nama,
        loket: dataKasir?.kodeloket,
      })
      onSuccess()
      toast.success("Berhasil melunasi data tagihan")
    } catch (err) {
      console.log(err)
      toast.error("Gagal melunasi data tagihan")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonLoading isLoading={isLoading}>Lunasi Data</ButtonLoading>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lunasi Tagihan</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-3">
          <Select onValueChange={setSelectedKasir} value={selectedKasir}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kasir" />
            </SelectTrigger>
            <SelectContent>
              {kasir?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogDescription>
        <DialogFooter>
          <ButtonLoading isLoading={isLoading} onClick={lunasiHandler}>
            Lunasi
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LunasiModal
