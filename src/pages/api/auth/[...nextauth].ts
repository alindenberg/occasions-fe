import { JWT } from "next-auth/jwt"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Configure your authentication providers here
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        },
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Is Sign Up", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { email, password, isSignUp } = credentials;
        const apiUrl = isSignUp === 'true'
          ? `${process.env.SERVER_URL}/signup`
          : `${process.env.SERVER_URL}/login`;

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          if (response.ok) {
            return {
              id: data.id,
              email: email,
              accessToken: data.access_token,
              accessTokenExpires: data.expires_at,
              refreshToken: data.refresh_token,
            };
          } else {
            // Throw an error for unsuccessful login/signup
            throw new Error(data.detail || 'Authentication failed');
          }
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        if (account.provider === 'google') {
          return {
            accessToken: account.id_token || account.access_token,
            accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now(),
            refreshToken: account.refresh_token,
            user,
          }
        }
        else if (account.provider === 'credentials') {
          return {
            accessToken: user.accessToken,
            accessTokenExpires: user.accessTokenExpires || Date.now(),
            refreshToken: user.refreshToken,
            provider: account.provider,
          }
        }
      }

      if (
        token.accessTokenExpires
        && typeof token.accessTokenExpires === 'number'
        && Date.now() < token.accessTokenExpires
      ) {
        return token
      }

      if (token.provider === 'credentials') {
        return refreshAccessToken(token)
      } else if (token.provider === 'google') {
        return refreshGoogleAccessToken(token)
      }

      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
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
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const response = await fetch(`${process.env.SERVER_URL}/google-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              google_id: user.id
            }),
          });

          if (!response.ok) {
            console.error('Failed to notify backend of sign-in');
            return false;
          }
        } catch (error) {
          console.error('Error notifying backend of sign-in:', error);
          return false;
        }
      } else if (account?.provider === 'credentials') {
        return true;
      }
      return false;
    }
  }
}

async function refreshGoogleAccessToken(token: any) {
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
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.SERVER_URL}/token/refresh`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: data.expires_at,
      refreshToken: data.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth(authOptions)