import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useColorScheme } from "nativewind";
import { AsyncStorageKey, Theme } from "@/app/utils/constant";
import { ThemeAction } from "@/app/contexts/action";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeState = {
  theme: Theme;
};

type Action = {
  type: ThemeAction.SetTheme;
  payload: Theme;
};

const defaultState: ThemeState = {
  theme: Theme.System,
};

export const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: Dispatch<Action>;
}>({
  state: defaultState,
  dispatch: () => null,
});

const ThemeReducer = (state: ThemeState, action: Action): ThemeState => {
  switch (action.type) {
    case ThemeAction.SetTheme:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export const ThemeProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(ThemeReducer, defaultState);
  const { setColorScheme, colorScheme } = useColorScheme();
  const [loading, setLoading] = useState<boolean>(true);

  const saveTheme = useCallback(async () => {
    try {
      if (state.theme !== colorScheme) {
        await AsyncStorage.setItem(AsyncStorageKey.AppTheme, state.theme);
        setColorScheme(state.theme as Theme);
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, [colorScheme, setColorScheme, state.theme]);

  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(AsyncStorageKey.AppTheme);
      const themeToSet =
        savedTheme ?? (colorScheme === "dark" ? Theme.Dark : Theme.Light);

      // Only dispatch and set color scheme if the theme has changed
      if (themeToSet !== state.theme) {
        setColorScheme(themeToSet as Theme);
        dispatch({ type: ThemeAction.SetTheme, payload: themeToSet as Theme });
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      setLoading(false);
    }
  }, [colorScheme, setColorScheme, state.theme]);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Save theme to AsyncStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveTheme(); // Only save theme if it's loaded and set
    }
  }, [state.theme, loading, saveTheme]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const safeContext = useContext(ThemeContext);

  if (safeContext === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }

  return safeContext;
};
