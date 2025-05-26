import type { NextAuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"

// Extend NextAuth's Session and User interfaces to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string | null
      nama: string
    }
  }

  interface User {
    id: string
    username: string | null
    nama: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string | null
    nama: string
  }
}

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { type: "username" },
        password: { type: "password" },
      },
      // Custom authorize function to validate user credentials
      async authorize(credentials) {
        if (!credentials) return null

        try {
          // Authenticate the user by sending credentials to an external API
          // Refer to the NextAuth.js documentation for handling custom sign-in flows:
          // https://next-auth.js.org/providers/credentials
          const res = await fetch(`${process.env.BASE_URL}/api/auth/sign-in`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })

          console.log(res)
          const payload = await res.json()

          // Throw error if the response status indicates a failure
          if (res.status >= 400) {
            console.log(res)
            throw new Error(payload?.message ?? "An unknown error occurred.")
          }

          return payload // Return user data on successful authentication
        } catch (e: unknown) {
          // Handle errors and provide appropriate error message
          console.log(e)
          throw new Error(
            e instanceof Error ? e.message : "An unknown error occurred."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // Set session expiration to 30 days
    // More info on session strategies: https://next-auth.js.org/getting-started/options#session
  },
  callbacks: {
    // Callback to add custom user properties to JWT
    // Learn more: https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nama = user.nama
        token.username = user.username
      }

      return token
    },
    // Callback to include JWT properties in the session object
    // Learn more: https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.nama = token.nama
        session.user.username = token.username
      }

      return session
    },
  },
}
