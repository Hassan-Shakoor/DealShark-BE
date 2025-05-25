import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { AuthAction } from "@/app/contexts/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKey } from "@/app/utils/constant";

type AuthState = {
  isReady: boolean;
  isLogin: string | null;
};

type Action =
  | { type: AuthAction.SetReady; payload: boolean }
  | { type: AuthAction.SetLoggedIn; payload: string | null };

const defaultState: AuthState = {
  isReady: false,
  isLogin: null,
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<Action>;
}>({ state: defaultState, dispatch: () => null });

export const AuthReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case AuthAction.SetReady:
      return { ...state, isReady: action.payload };
    case AuthAction.SetLoggedIn:
      return { ...state, isLogin: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(AuthReducer, defaultState);

  const fetchAuthFromStorage = useCallback(async () => {
    try {
      const storageValue = await AsyncStorage.getItem(AsyncStorageKey.Token);
      console.log(storageValue);
      if (storageValue) {
        dispatch({
          type: AuthAction.SetLoggedIn,
          payload: storageValue,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: AuthAction.SetReady, payload: true });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAuthFromStorage();
  }, [fetchAuthFromStorage]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
