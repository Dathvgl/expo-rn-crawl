import { ThemeType } from "~/contexts/ThemeContext";

declare module "@react-navigation/native" {
  export function useTheme(): ThemeType;
}
