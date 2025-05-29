import { z } from "zod"

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  nama: z.string(),
  role: z.enum(["super_admin", "admin", "user"]),
  client_access: z.array(z.string()).optional(),
})

export type UserSchemaType = z.infer<typeof UserSchema>
