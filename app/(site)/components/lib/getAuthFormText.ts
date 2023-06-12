type AuthFormKey =
  | "googleLogin"
  | "googleSignUp"
  | "signIn"
  | "signUp"
  | "isAccount"
  | "noAccount"
  | "login"
  | "register"
  | "defaultHeading"
  | "userAccountHeading";

export const getAuthFormText: Record<AuthFormKey, string> = {
  googleLogin: "Sign in with Google",
  googleSignUp: "Sign up with Google",
  signIn: "Sign in",
  signUp: "Sign up",
  isAccount: "Already have an account?",
  noAccount: "Don't have an account?",
  login: "Login",
  register: "Sign up",
  defaultHeading:
    "Become a member of our engaging chat community. Let's connect, share, and explore together!",
  userAccountHeading:
    "Welcome back, please provide your credentials to connect with the community.",
};
