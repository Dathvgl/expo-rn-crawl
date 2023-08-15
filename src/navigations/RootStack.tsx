import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchBar from "~/components/SearchBar";
import { MangaSearchProvider } from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import HomeScreen from "~/screens/HomeScreen";
import SearchScreen from "~/screens/SearchScreen";
import MangaChapterScreen from "~/screens/manga/MangaChapterScreen";
import MangaScreen from "~/screens/manga/MangaScreen";
import { RootDrawer } from "./RootDrawer";

export type RootStackParamList = {
  RootStackHome: undefined;
  RootStackSearch: undefined;
  RootStackManga: { id: string };
  RootStackMangaChapter: { mangaId: string; chapterId: string };
};

export type RootStack = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const StackNavigator = Stack.Navigator;
const StackScreen = Stack.Screen;

export default function RootStack() {
  const navigation = useNavigation<RootDrawer>();
  const { colors } = useThemeContext().useTheme;

  return (
    <MangaSearchProvider>
      <StackNavigator
        initialRouteName="RootStackHome"
        screenOptions={{
          contentStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.text,
          },
        }}
      >
        <StackScreen
          name="RootStackHome"
          component={HomeScreen}
          options={({
            navigation: stackNavigation,
          }: {
            navigation: RootStack;
          }) => ({
            header(props) {
              return (
                <SafeAreaView
                  {...props}
                  className="w-full"
                  style={{ backgroundColor: colors.background }}
                >
                  <View
                    className="w-full px-3 py-4 flex flex-row items-center justify-between"
                    style={{
                      columnGap: 8,
                      minHeight: 56,
                      borderTopWidth: 1,
                      borderTopColor: colors.text,
                      backgroundColor: colors.main,
                    }}
                  >
                    <TouchableRipple
                      className="w-6 h-6 flex flex-row items-center justify-center"
                      onPress={navigation.toggleDrawer}
                    >
                      <Ionicons name="menu" size={25} color={colors.text} />
                    </TouchableRipple>
                    <TouchableRipple
                      className="w-6 h-6 flex flex-row items-center justify-center"
                      onPress={() => stackNavigation.push("RootStackSearch")}
                    >
                      <Ionicons name="search" size={25} color={colors.text} />
                    </TouchableRipple>
                  </View>
                </SafeAreaView>
              );
            },
          })}
        />
        <StackScreen
          name="RootStackSearch"
          component={SearchScreen}
          options={({
            navigation: stackNavigation,
          }: {
            navigation: RootStack;
          }) => ({
            header(props) {
              return (
                <SafeAreaView
                  className="w-full"
                  style={{ backgroundColor: colors.background }}
                  {...props}
                >
                  <View
                    className="w-full px-3 py-4 flex flex-row items-center"
                    style={{
                      minHeight: 56,
                      borderTopWidth: 1,
                      borderTopColor: colors.text,
                      backgroundColor: colors.main,
                    }}
                  >
                    <SearchBar navigation={stackNavigation} />
                  </View>
                </SafeAreaView>
              );
            },
          })}
        />
        <StackScreen name="RootStackManga" component={MangaScreen} />
        <StackScreen
          name="RootStackMangaChapter"
          component={MangaChapterScreen}
          options={{ headerShown: false }}
        />
      </StackNavigator>
    </MangaSearchProvider>
  );
}
