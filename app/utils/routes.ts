export const ROUTES = {
  AuthHome: "/auth-home",
  SignIn: "/sign-in",
  SignUp: "/sign-up",
  TermsAndConditions: "/terms-and-condition",
  Chat: "/(chat)",
  ChatView: (id: string) => `/(chat)/${id}` as const,
  Purchase: "/purchase",
  Setting: "/setting",
  CompanionSetting: "/companion-setting",
} as const;

export const APIS = {
  signIn: "/auth/signin",
  signUp: "/auth/signup/",
  acceptTerm: "/auth/accept-terms",
};
