export const ROUTES = {
  AuthHome: "/auth-home",
  SignIn: "/sign-in",
  SignUp: "/sign-up",
  TermsAndConditions: "/terms-and-condition",
  Chat: "/(chat)",
  ChatView: (id: string | number) => `/(chat)/${id}` as const,
  Purchase: "/purchase",
  Setting: "/setting",
  CompanionSetting: (id: string | number) =>
    `/companion-setting/${id}` as const,
} as const;

export const APIS = {
  signIn: "/auth/signin",
  signUp: "/auth/signup/",
  acceptTerm: "/auth/accept-terms",
  fetchAllChats: "/chats/",
  fetchAllPinnedChats: "/chats/pinned/",
  createNewChat: "/chats/new",
  fetchUserSetting: "/settings",
  fetchCompanionSetting: (id: string | number) =>
    `/settings/companion?chat_id=${id}` as const,
  fetchIndividualChat: (id: string | number) =>
    `/chats/${id}/messages` as const,
  sendIndividualMessage: (id: string | number) => `/chats/?chat_id=${id}`,
  pinChat: (id: string | number) => `/chats/${id}/pin` as const,
  unPinChat: (id: string | number) => `/chats/${id}/unpin` as const,
  updateCompanionSetting: (id: string | number) =>
    `/settings/companion/?chat_id=${id}` as const,
};
