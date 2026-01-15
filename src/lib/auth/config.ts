import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@ba12automotive.co.uk" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query admin user from database
          const result = await sql.query(
            'SELECT * FROM admin_users WHERE email = $1',
            [credentials.email]
          );

          const user = result.rows[0];

          if (!user) {
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);

          if (!passwordMatch) {
            return null;
          }

          // Update last login
          await sql.query(
            'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
            [user.id]
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Prevent redirect loops by ensuring we redirect to the right place
      // If the URL is a relative path, prepend baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If the URL is on the same domain, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Otherwise, redirect to the base URL (home page or admin dashboard)
      return `${baseUrl}/admin`;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
