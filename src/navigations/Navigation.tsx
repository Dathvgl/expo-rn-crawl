import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import {
  darkTheme,
  lightTheme,
  useThemeContext,
} from "~/contexts/ThemeContext";
import RootDrawer from "./RootDrawer";

export default function Navigation() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme ? darkTheme : lightTheme}>
      <PaperProvider>
        <RootDrawer />
      </PaperProvider>
    </NavigationContainer>
  );
}
