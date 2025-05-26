"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import type { SignInSchemaType } from "@/schemas/sign-in-schema"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { toast } from "@/hooks/use-toast"
import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectPathname = searchParams.get("redirectTo") || "/dashboard"

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting

  async function onSubmit(data: SignInSchemaType) {
    const { username, password } = data

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (result && result.error) {
        throw new Error(result.error)
      }

      router.push(redirectPathname)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grow gap-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan username" {...field} />
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
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Login
        </ButtonLoading>
      </form>
    </Form>
  )
}
