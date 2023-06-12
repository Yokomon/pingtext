import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import prismadb from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Authorization error");

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        const socialUser = await prismadb.account.findFirst({
          where: {
            userId: user?.id,
          },
        });

        if (user?.email && socialUser?.provider) {
          throw new Error(
            `User registered with ${socialUser.provider.replace(
              /^./,
              socialUser.provider[0].toUpperCase()
            )}`
          );
        }

        if (!user?.email || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
