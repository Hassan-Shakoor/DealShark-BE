import { Platform } from "react-native";

export const setupPWAKeyboardHandling = () => {
  if (Platform.OS !== "web") return;

  // iOS PWA Keyboard Fix
  const handleInputFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      // Force virtual keyboard on iOS PWA
      setTimeout(() => {
        target.focus();
        // Trigger input event to ensure keyboard appears
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }, 150);
    }
  };

  const handleInputTouch = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      // Prevent default touch behavior that might interfere with keyboard
      event.preventDefault();
      event.stopPropagation();

      // Focus the input and trigger keyboard
      setTimeout(() => {
        target.focus();
        target.click();
      }, 50);
    }
  };

  const handleInputClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      // Ensure keyboard appears on click for iOS PWA
      setTimeout(() => {
        target.focus();
      }, 100);
    }
  };

  // Add event listeners
  document.addEventListener("focus", handleInputFocus, true);
  document.addEventListener("touchstart", handleInputTouch, true);
  document.addEventListener("click", handleInputClick, true);

  // Return cleanup function
  return () => {
    document.removeEventListener("focus", handleInputFocus, true);
    document.removeEventListener("touchstart", handleInputTouch, true);
    document.removeEventListener("click", handleInputClick, true);
  };
};

export const forceKeyboardOnInput = (element: HTMLElement) => {
  if (Platform.OS !== "web") return;

  // Force keyboard to appear on iOS PWA
  element.focus();
  element.click();

  // Trigger input event
  setTimeout(() => {
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }, 100);
};
