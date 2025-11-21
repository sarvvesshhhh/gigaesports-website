import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "build-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "build-placeholder",
    }),
  ],
  // CRITICAL: This fallback prevents the "Missing required NEXTAUTH_SECRET" error
  secret: process.env.NEXTAUTH_SECRET || "build-placeholder-secret",
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }