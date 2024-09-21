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
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.id_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now(),
          refreshToken: account.refresh_token,
          user,
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user
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
        return session
      }
    }
  }
}

async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth(authOptions)