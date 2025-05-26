import { z } from "zod"

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  nama: z.string(),
})

export type UserSchemaType = z.infer<typeof UserSchema>
