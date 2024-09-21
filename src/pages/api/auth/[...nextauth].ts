import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Configure your authentication providers here
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("token", token)
      console.log("account", account)
      if (account) {
        token.accessToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        try {
          const response = await fetch(`${process.env.SERVER_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token.accessToken}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            session.user = {
              ...session.user,
              ...userData,
            };
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session
    },
  }
}

export default NextAuth(authOptions)