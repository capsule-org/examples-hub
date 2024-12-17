export type ScreenName = "AuthSelection" | "EmailAuth" | "PhoneAuth" | "OAuthSelection" | "Home";

export interface NavigationProps {
  goToScreen: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
}

export interface ScreenParams {
  provider?: string;
  isNewUser?: boolean;
}

export interface StackEntry {
  screen: ScreenName;
  params?: ScreenParams;
}
