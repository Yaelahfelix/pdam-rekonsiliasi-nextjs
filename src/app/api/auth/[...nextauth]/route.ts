import { authOptions } from "@/config/next-auth"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

// Export the handler to be used as GET and POST methods for Route Handlers
// More info: https://next-auth.js.org/configuration/initialization#route-handlers-app
export { handler as GET, handler as POST }
