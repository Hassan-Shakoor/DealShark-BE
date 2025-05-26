import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import {
  Chat,
  CompanionSetting as CompanionSettingType,
  Message,
  PinnedMessage,
} from "@/app/types/Chat";
import { ChatAction } from "@/app/contexts/action";

type ChatState = {
  chatSearchQuery: string;
  chatList: Chat[];
  individualMessage: Chat | null;
  waitingForResponse: boolean;
  pinnedChats: PinnedMessage[];
  companionSetting: CompanionSettingType | null;
};

type Action =
  | { type: ChatAction.SetChatSearchQuery; payload: string }
  | { type: ChatAction.SetChatList; payload: Chat[] }
  | { type: ChatAction.AddChat; payload: Chat }
  | { type: ChatAction.SetIndividualMessage; payload: Chat }
  | { type: ChatAction.SetWaitingForResponse; payload: boolean }
  | { type: ChatAction.SetPinnedChats; payload: PinnedMessage[] }
  | {
      type: ChatAction.SetCompanionSetting;
      payload: CompanionSettingType | null;
    };

const defaultState: ChatState = {
  chatSearchQuery: "",
  chatList: [],
  individualMessage: null,
  waitingForResponse: false,
  pinnedChats: [],
  companionSetting: null,
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
    case ChatAction.SetIndividualMessage:
      return { ...state, individualMessage: action.payload };
    case ChatAction.SetWaitingForResponse:
      return { ...state, waitingForResponse: action.payload };
    case ChatAction.SetPinnedChats:
      return { ...state, pinnedChats: action.payload };
    case ChatAction.SetCompanionSetting:
      return { ...state, companionSetting: action.payload };
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
