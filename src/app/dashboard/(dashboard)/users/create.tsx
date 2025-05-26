"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import type { UserSchemaType } from "@/schemas/user-schema"

import { UserSchema } from "@/schemas/user-schema"

import { Button } from "@/components/ui/button"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// type Props = {}

const CreateUserModal = () => {
  const form = useForm<UserSchemaType>({
    defaultValues: {
      username: "",
      nama: "",
      password: "",
    },
    resolver: zodResolver(UserSchema),
  })
  const Router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const onSubmit = (data: UserSchemaType) => {
    axios
      .post("/api/users", data)
      .then((response) => {
        console.log("User created successfully:", response.data)
        form.reset()
        setIsOpen(false)
        Router.refresh()
      })
      .catch((error) => {
        console.error("Error creating user:", error)
      })
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat user baru</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                className="space-y-4 mt-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                <div className="flex justify-end mt-5">
                  <Button type="submit">Buat</Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal
