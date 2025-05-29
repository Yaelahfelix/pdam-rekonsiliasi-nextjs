"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Pencil } from "lucide-react"

import type { UserSchemaType } from "@/schemas/user-schema"

import { UserSchema } from "@/schemas/user-schema"

import { Button, ButtonLoading } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MultipleSelector from "@/components/multipleSelect"

// type Props = {}

const EditUserModal = ({
  values,
  setIsOpen,
  isOpen,
}: {
  values?: UserSchemaType
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
}) => {
  const form = useForm<UserSchemaType>({
    defaultValues: {
      id: values?.id,
      username: values?.username || "",
      nama: values?.nama || "",
      password: "",
      role: values?.role || "user",
      client_access: values?.client_access || [],
    },
    resolver: zodResolver(UserSchema),
  })
  const role = form.watch("role")
  const Router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = (data: UserSchemaType) => {
    setIsLoading(true)
    axios
      .put("/api/users", data)
      .then(() => {
        form.reset()
        toast.success("Berhasil membuat user baru")
        setIsOpen(false)
        Router.refresh()
      })
      .catch((error) => {
        toast.error("Gagal membuat user baru")
        console.error("Error creating user:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Pencil className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update data user</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                className="space-y-4 mt-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Administrator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="super_admin">
                            Super Admin
                          </SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {role === "user" && (
                  <FormField
                    control={form.control}
                    name="client_access"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Akses Client</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            defaultOptions={[
                              { label: "Kediri", value: "kediri" },
                              { label: "Probolinggo", value: "probolinggo" },
                              { label: "Nganjuk", value: "nganjuk" },
                            ]}
                            onChange={(val) =>
                              field.onChange(val.map((v) => v.value))
                            }
                            value={field.value?.map((v) => ({
                              label: v.charAt(0).toUpperCase() + v.slice(1),
                              value: v,
                            }))}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Pilih client yang dapat diakses oleh user ini.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end mt-5">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false)
                      form.reset()
                    }}
                    className="mr-2"
                  >
                    Batal
                  </Button>
                  <ButtonLoading type="submit" isLoading={isLoading}>
                    Buat
                  </ButtonLoading>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserModal
