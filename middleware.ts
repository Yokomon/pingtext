import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/pings/:path*",
    "/friends/:path*",
    "/notifications/:path*",
    "/calls/:path*",
  ],
};
