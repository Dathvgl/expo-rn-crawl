import { enableScreens } from "react-native-screens";
enableScreens();

import "react-native-gesture-handler";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MangaProvider } from "~/contexts/MangaContext";
import { ThemeProvider } from "~/contexts/ThemeContext";
import Navigation from "~/navigations/Navigation";

// import "./styles.css";

// if (Platform.OS == "web") {
//   require("./styles.css");
// }

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: 1 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    retry: 3,
    structuralSharing: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MangaProvider>
          <Navigation />
        </MangaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
