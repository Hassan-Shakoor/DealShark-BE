import { useCallback, useRef, useEffect } from "react";
import { TextInput, Platform } from "react-native";

export const useKeyboardHandler = () => {
  const inputRef = useRef<TextInput>(null);

  const focusInput = useCallback(() => {
    if (Platform.OS === "web" && inputRef.current) {
      // Force keyboard to appear on iOS PWA
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Trigger additional events to ensure keyboard appears
          const element = inputRef.current as any;
          if (element && element._nativeTag) {
            const domElement = document.querySelector(
              `[data-testid="${element._nativeTag}"]`,
            );
            if (domElement) {
              domElement.focus();
              domElement.click();
            }
          }
        }
      }, 150);
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    if (Platform.OS === "web") {
      // Additional focus handling for iOS PWA
      setTimeout(() => {
        focusInput();
      }, 100);
    }
  }, [focusInput]);

  const handleInputTouch = useCallback(() => {
    if (Platform.OS === "web") {
      // Handle touch events for iOS PWA
      setTimeout(() => {
        focusInput();
      }, 50);
    }
  }, [focusInput]);

  return {
    inputRef,
    focusInput,
    handleInputFocus,
    handleInputTouch,
  };
};
