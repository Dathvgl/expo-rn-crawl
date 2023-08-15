import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerNavigationProp,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { Platform, View } from "react-native";
import { Switch, Text, TouchableRipple } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "~/contexts/ThemeContext";
import SettingScreen from "~/screens/SettingScreen";
import RootStack from "./RootStack";

export type RootDrawerParamList = {
  RootDrawerHome: undefined;
  RootDrawerSetting: undefined;
};

export type RootDrawer = DrawerNavigationProp<RootDrawerParamList>;

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const DrawerNavigator = Drawer.Navigator;
const DrawerScreen = Drawer.Screen;

function DrawerIcon({ name, focus }: { name?: string; focus: boolean }) {
  const size = 25;

  switch (name) {
    case "Home":
      return (
        <FontAwesome
          name="home"
          size={size}
          color={focus ? "rgba(255,255,255,0.98)" : undefined}
        />
      );
    case "Settings":
      return (
        <Ionicons
          name="settings"
          size={size}
          color={focus ? "rgba(255,255,255,0.98)" : undefined}
        />
      );
    default:
      return <></>;
  }
}

function DrawerContent(props: DrawerContentComponentProps) {
  const { theme, setTheme } = useThemeContext();
  const { colors } = useThemeContext().useTheme;
  const { state, descriptors, navigation } = props;

  const drawerProgress = useDrawerProgress() as { value: number };

  const animatedLayout = (type: "top" | "bottom") =>
    useAnimatedStyle(() => {
      const item = type == "top" ? -100 : 100;
      const translateY = interpolate(drawerProgress.value, [0, 1], [item, 0]);
      const opacity = interpolate(drawerProgress.value, [0, 1], [0, 1]);

      return {
        transform: [{ translateY }],
        opacity,
      };
    });

  return (
    <SafeAreaView className="flex-1">
      <Animated.View
        className="flex flex-row items-center pl-4 h-12 m-2 rounded overflow-hidden"
        style={[animatedLayout("top"), { backgroundColor: colors.popup }]}
      >
        <Text className="font-bold text-lg" style={{ color: colors.text }}>
          FSTruyen
        </Text>
      </Animated.View>
      <DrawerContentScrollView
        {...props}
        style={{ margin: 8, borderRadius: 4, backgroundColor: colors.popup }}
        contentContainerStyle={{
          borderRadius: 4,
          overflow: "hidden",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {state.routes.map((item, index) => {
          const isFocused = state.index === index;
          const {
            options: { title },
          } = descriptors[item.key];

          return (
            <TouchableRipple
              key={index}
              className="px-4 py-2"
              style={{
                backgroundColor: isFocused ? colors.primary : undefined,
              }}
              onPress={() => {
                const event = navigation.emit({
                  type: "drawerItemPress",
                  target: item.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(item.name);
                }
              }}
            >
              <View className="flex flex-row items-center">
                <View className="w-10">
                  <DrawerIcon name={title} focus={isFocused} />
                </View>
                <Text
                  className="text-base font-bold"
                  style={{ color: isFocused ? "white" : colors.text }}
                >
                  {title}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </DrawerContentScrollView>
      <Animated.View
        className="flex flex-row items-center justify-between pl-4 h-12 m-2 rounded overflow-hidden"
        style={[animatedLayout("bottom"), { backgroundColor: colors.popup }]}
      >
        <Text style={{ color: colors.text }}>Dark mode</Text>
        <Switch
          value={theme}
          onValueChange={(value) => {
            if (value) setTheme(true);
            else setTheme(false);
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

export default function RootDrawer() {
  const { colors } = useThemeContext().useTheme;

  return (
    <DrawerNavigator
      initialRouteName="RootDrawerHome"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.text,
        drawerType: "front",
        drawerStyle: { backgroundColor: "transparent" },
        swipeEdgeWidth: Platform.OS == "android" ? 180 : undefined,
        drawerContentStyle: {
          borderBottomWidth: 1,
          borderBottomColor: colors.text,
        },
      }}
    >
      <DrawerScreen
        name="RootDrawerHome"
        component={RootStack}
        options={{
          title: "Home",
          headerStyle: { height: 0 },
          headerLeft(props) {
            return <></>;
          },
          headerTitle(props) {
            return <></>;
          },
          headerRight(props) {
            return <></>;
          },
        }}
      />
      <DrawerScreen
        name="RootDrawerSetting"
        component={SettingScreen}
        options={{
          title: "Settings",
          headerShown: true,
          headerTitle: "Settings",
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colors.text,
          },
        }}
      />
    </DrawerNavigator>
  );
}
