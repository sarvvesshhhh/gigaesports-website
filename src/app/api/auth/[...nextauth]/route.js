import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      // Fallback to dummy strings so build doesn't fail
      clientId: process.env.GOOGLE_CLIENT_ID || "build-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "build-placeholder",
    }),
  ],
  // CRITICAL FIX: Provide a fallback secret
  secret: process.env.NEXTAUTH_SECRET || "build-placeholder-secret",
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }