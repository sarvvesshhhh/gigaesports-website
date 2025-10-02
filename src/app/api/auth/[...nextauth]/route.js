import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// V-- EXPORT YOUR AUTH OPTIONS --V
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }