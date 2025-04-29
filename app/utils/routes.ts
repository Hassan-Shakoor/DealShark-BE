export const ROUTES = {
  Home: "/",
  SignIn: "/(auth)/sign-in",
  SignUp: "/(auth)/sign-up",
  TermsAndConditions: "/terms-and-condition",
  Chat: "/(chat)/chat",
  ChatView: (id: string) => `/(chat)/${id}` as const,
  Purchase: "/purchase",
  Setting: "/setting",
  CompanionSetting: "/companion-setting",
} as const;
