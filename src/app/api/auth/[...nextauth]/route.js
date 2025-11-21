import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "", // Fallback to empty string if missing
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // Use a fallback secret during build if the env var is missing
  secret: process.env.NEXTAUTH_SECRET || "temporary-secret-for-build", 
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }