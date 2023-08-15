import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BackHandler, Dimensions, FlatList, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Badge, Text, TouchableRipple } from "react-native-paper";
import { Zoom, createZoomListComponent } from "react-native-reanimated-zoom";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MangaAPI from "~/apis/MangaAPI";
import { useMangaContext } from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import { RootStack, RootStackParamList } from "~/navigations/RootStack";
import { MangaDetailChapterClient, MangaIndex } from "~/types/manga";

const ZoomFlatList = createZoomListComponent(FlatList);

function MangaChapterIndex(props: {
  icon: string;
  name: string;
  side: "left" | "right";
  index: MangaIndex | null;
}) {
  const { icon, name, side, index } = props;
  const { theme, useTheme } = useThemeContext();
  const { colors } = useTheme;

  return (
    <View className="flex flex-row items-center justify-center">
      <TouchableRipple
        rippleColor={theme ? "rgba(254, 240, 138, 0.3)" : "rgba(1, 1, 1, 0.2)"}
        onPress={index ? () => {} : undefined}
      >
        <View className="flex flex-row items-center px-2 py-1">
          {side == "left" && (
            <MaterialIcons
              name={icon}
              size={20}
              color={
                index
                  ? colors.primary
                  : theme
                  ? "rgba(254, 240, 138, 0.4)"
                  : "rgba(1, 1, 1, 0.4)"
              }
            />
          )}
          <Text
            className="font-bold text-base"
            style={{
              color: index
                ? colors.primary
                : theme
                ? "rgba(254, 240, 138, 0.4)"
                : "rgba(1, 1, 1, 0.4)",
            }}
          >
            {name}
          </Text>
          {side == "right" && (
            <MaterialIcons
              name={icon}
              size={20}
              color={
                index
                  ? colors.primary
                  : theme
                  ? "rgba(254, 240, 138, 0.4)"
                  : "rgba(1, 1, 1, 0.4)"
              }
            />
          )}
        </View>
      </TouchableRipple>
    </View>
  );
}

type Sample = {
  _id: string;
  chapterId: string;
  chapterIndex: string;
  src: string;
};

function MangaChapterDetail(props: { stackNavigation: RootStack }) {
  const { stackNavigation } = props;

  const route =
    useRoute<RouteProp<MangaChapterDrawerParamList, "MangaChapterScreen">>();
  const { mangaId, chapterId } = route.params;
  const navigation = useNavigation<MangaChapterDrawer>();

  const { top } = useSafeAreaInsets();
  const { colors } = useThemeContext().useTheme;
  const { mangaType } = useMangaContext();

  const [scroll, setScroll] = useState(false);
  const [visible, setVisible] = useState(true);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["manga", "detail", mangaId, "chapter", chapterId, mangaType],
    queryFn: () => MangaAPI.image(mangaId, chapterId, mangaType),
  });

  useEffect(() => {
    refetch();
  }, [chapterId]);

  function onDetail() {
    stackNavigation.dispatch(
      StackActions.replace("RootStackManga", { id: mangaId })
    );
  }

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  const keyExtractor = (item: Sample) => item._id;

  const renderItem = ({ item, index }: { item: Sample; index: number }) => {
    if (!item.src) return <></>;
    return (
      <Zoom>
        <TouchableWithoutFeedback
          key={index}
          onPress={() => {
            if (scroll) setVisible(!visible);
          }}
        >
          <AutoHeightImage
            width={Dimensions.get("window").width}
            source={{ uri: item.src }}
          />
        </TouchableWithoutFeedback>
      </Zoom>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        className={`${visible ? "flex" : "hidden"} absolute z-10 w-full`}
        style={{ paddingTop: top }}
      >
        <View
          className="flex flex-row items-center h-14 px-4"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.text,
            borderBottomWidth: 1,
            borderBottomColor: colors.text,
            backgroundColor: colors.main,
          }}
        >
          <TouchableRipple
            className="w-6 h-6 flex flex-row items-center justify-center"
            onPress={stackNavigation.goBack}
          >
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </TouchableRipple>
          <View className="flex-1 pl-6 pr-2">
            {data.current && (
              <Text
                className="text-base font-bold"
                style={{ color: colors.text }}
              >
                {data.current.chapter < 0
                  ? "One shot"
                  : `Chapter ${data.current.chapter}`}
              </Text>
            )}
          </View>
          <View
            className="flex flex-row items-center"
            style={{ columnGap: 10 }}
          >
            <TouchableRipple onPress={onDetail}>
              <Entypo name="info-with-circle" size={25} color={colors.text} />
            </TouchableRipple>
            <TouchableRipple onPress={navigation.toggleDrawer}>
              <Ionicons name="list" size={30} color={colors.text} />
            </TouchableRipple>
          </View>
        </View>
      </View>
      <View
        className={`${
          visible ? "flex" : "hidden"
        } absolute z-10 w-full bottom-0`}
      >
        <View
          className="flex flex-row items-center h-14 px-4"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.text,
            backgroundColor: colors.main,
          }}
        >
          <View
            className="flex flex-row items-center"
            style={{ columnGap: 20 }}
          >
            <MangaChapterIndex
              icon="arrow-back-ios"
              name="PREV"
              side="left"
              index={data.canPrev}
            />
            <MangaChapterIndex
              icon="arrow-forward-ios"
              name="NEXT"
              side="right"
              index={data.canNext}
            />
          </View>
          <View
            className="w-0.5 h-full mx-3"
            style={{ backgroundColor: colors.border }}
          />
          <View className="flex-1 flex flex-row items-center h-full">
            <View className="flex-1 flex flex-row justify-center">
              <TouchableRipple onPress={() => {}}>
                <Ionicons name="heart" size={30} color="darkred" />
              </TouchableRipple>
            </View>
            <View className="flex-1 flex flex-row justify-center">
              <TouchableRipple onPress={() => {}}>
                <View className="relative">
                  <FontAwesome name="comments" size={30} color={colors.text} />
                  <Badge className="absolute -top-1.5 -right-3" size={25}>
                    3
                  </Badge>
                </View>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </View>
      <ZoomFlatList
        onScroll={(event) => {
          const limitHeight = 48;
          const { y } = event.nativeEvent.contentOffset;
          const height =
            event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height;

          if (!scroll) {
            if (y > limitHeight && y < height - limitHeight) {
              setScroll(true);
              setVisible(false);
            }
          } else {
            if (y <= limitHeight || y >= height - limitHeight) {
              setScroll(false);
              setVisible(true);
            }
          }
        }}
        ListHeaderComponent={<View className="h-14" />}
        ListFooterComponent={<View className="h-14" />}
        keyExtractor={keyExtractor}
        data={data.current?.chapters}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

type MangaChapterDrawerParamList = {
  [key: string]: { mangaId: string; chapterId: string };
};

type MangaChapterDrawer = DrawerNavigationProp<MangaChapterDrawerParamList>;

const Drawer = createDrawerNavigator<MangaChapterDrawerParamList>();
const DrawerNavigator = Drawer.Navigator;
const DrawerScreen = Drawer.Screen;

function DrawerContent(
  props: DrawerContentComponentProps & {
    mangaId: string;
    chapters: MangaDetailChapterClient[];
  }
) {
  const { mangaId, chapters, ...rest } = props;

  const { colors } = useThemeContext().useTheme;
  const { state, navigation } = rest;

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        {...rest}
        style={{ margin: 8, borderRadius: 4, backgroundColor: colors.popup }}
        contentContainerStyle={{
          borderRadius: 4,
          overflow: "hidden",
          paddingTop: 0,
          paddingBottom: 0,
        }}
        data={chapters}
        renderItem={({ item, index }) => {
          const isFocused = state.index == index;
          return (
            <TouchableRipple
              key={index}
              className="px-4 py-2"
              style={{
                backgroundColor: isFocused ? colors.primary : undefined,
              }}
              onPress={() => {
                const route = state.routes[index];
                const event = navigation.emit({
                  type: "drawerItemPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              <View className="flex flex-row items-center">
                <Text
                  className="text-base font-bold"
                  style={{ color: isFocused ? "white" : colors.text }}
                >
                  {item.chapter < 0 ? "One shot" : `Chapter ${item.chapter}`}
                </Text>
              </View>
            </TouchableRipple>
          );
        }}
      />
    </SafeAreaView>
  );
}

export default function MangaChapterScreen() {
  const navigation = useNavigation<RootStack>();
  const route =
    useRoute<RouteProp<RootStackParamList, "RootStackMangaChapter">>();
  const { mangaId, chapterId } = route.params;

  const { mangaType } = useMangaContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga", "detail", "chapter", mangaId, mangaType],
    queryFn: () => MangaAPI.chapter(mangaId, mangaType),
  });

  useEffect(() => {
    const backHandle = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backHandle);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandle);
    };
  }, []);

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  return (
    <DrawerNavigator
      initialRouteName={`MangaChapterScreen-${chapterId}`}
      drawerContent={(props) => (
        <DrawerContent {...props} mangaId={mangaId} chapters={data} />
      )}
      screenOptions={{ headerShown: false, drawerPosition: "right" }}
    >
      {/* <DrawerScreen
        name="MangaChapterScreen"
        initialParams={{ mangaId, chapterId }}
      >
        {() => <MangaChapterDetail stackNavigation={navigation} />}
      </DrawerScreen> */}
      {data.map((item, index) => (
        <DrawerScreen
          key={index}
          name={`MangaChapterScreen-${item._id}`}
          initialParams={{ mangaId, chapterId: item._id }}
        >
          {() => <MangaChapterDetail stackNavigation={navigation} />}
        </DrawerScreen>
      ))}
    </DrawerNavigator>
  );
}
