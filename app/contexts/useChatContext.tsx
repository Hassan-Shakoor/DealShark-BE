import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { Chat } from "@/app/types/Chat";
import { ChatAction } from "@/app/contexts/action";

type ChatState = {
  chatSearchQuery: string;
  chatList: Chat[];
};

type Action =
  | { type: ChatAction.SetChatSearchQuery; payload: string }
  | { type: ChatAction.SetChatList; payload: Chat[] }
  | { type: ChatAction.AddChat; payload: Chat };

const defaultState: ChatState = {
  chatSearchQuery: "",
  chatList: [],
};

export const ChatContext = createContext<{
  state: ChatState;
  dispatch: Dispatch<Action>;
}>({ state: defaultState, dispatch: () => null });

export const ChatReducer = (state: ChatState, action: Action): ChatState => {
  switch (action.type) {
    case ChatAction.SetChatList:
      return { ...state, chatList: action.payload };
    case ChatAction.AddChat:
      return { ...state, chatList: [...state.chatList, action.payload] };
    case ChatAction.SetChatSearchQuery:
      return { ...state, chatSearchQuery: action.payload };
    default:
      return state;
  }
};

export const ChatProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(ChatReducer, defaultState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
