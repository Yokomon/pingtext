import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
});

export const config = {
  matcher: [
    "/pings/:path*",
    "/friends/:path*",
    "/notifications/:path*",
    "/calls/:path*",
  ],
};
