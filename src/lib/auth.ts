import 'server-only';

import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { hash, compare } from 'bcrypt';

import prisma from '@/lib/prisma';

export async function hashPassword(password) {
  return await hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma as any),
  // --------------------------------------------
  // auth storage/handling: session using jwt stored in a cookie
  // no sessions stored in the DB
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
    // i think place the fields for the session model here if storing session in db
  },
  // --------------------------------------------
  // auth storage/handling: plain jwt
  // jwt: { maxAge: 60 * 60 * 24 * 30 },
  // --------------------------------------------
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      // console.log('Session Callback', { session, token });
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role,
        profile: token.profile,
      };
      // alternative shortcut but possible repetition of keys and additional keys included like iat, exp, jti
      // session.user = {
      //   ...session.user,
      //   ...token
      // };
      return session;
      // alternative
      // return {
      //   ...session,
      //   user: {
      //     ...session.user,
      //     id: token.id,
      //     role: token.role,
      //     profile: token.profile,
      //   },
      // };
    },
    async jwt({ token, user }) {
      // console.log("JWT Callback", { token, user });
      return { ...token, ...user };
      // alternative
      // if (user) {
      //   const u = user as unknown as any;
      //   return {
      //     ...token,
      //     id: u.id,
      //     role: u.role,
      //     profile: u.profile,
      //   };
      // }
      // return token;
    },
    //   async signIn({ user }) {
    //     // block signin if necessary
    //     return true;
    //   }
    redirect() {
      return '/';
    },
  },
  providers: [
    CredentialsProvider({
      // if using built-in next.js sign-in form
      id: 'email-pword',
      name: 'Email & Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your_email@mail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'your password',
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
          include: {
            profile: true,
          },
        });

        if (!existingUser) {
          return null;
        }

        // check if inputted password is equal to existingUser's hashed password in DB
        const userIsAMatch = await verifyPassword(
          credentials.password,
          existingUser.password,
        );

        if (!userIsAMatch) {
          return null;
        }

        // extract required User's fields (excluding password)
        const { id, email, role, profile: userProfile } = existingUser;

        // only include UserProfile's name fields
        const { first_name, middle_name, last_name, suffix_name, full_name } =
          userProfile;
        const profile = {
          first_name,
          middle_name,
          last_name,
          suffix_name,
          full_name,
        };

        // forward to jwt callback
        return {
          id,
          email,
          role,
          profile,
        };
      },
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
