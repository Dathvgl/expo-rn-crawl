import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import MangaAPI from "~/apis/MangaAPI";
import CustomFlatList from "~/components/FlatList";
import { ImageThumnail } from "~/components/Image";
import { SBHeight } from "~/components/SizeBox";
import { useMangaContext } from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import { RootStack } from "~/navigations/RootStack";
import { tsFromNow } from "~/utils/Date";
import MangaDialog from "./components/Dialog";

export default function HomeScreen() {
  const navigation = useNavigation<RootStack>();
  const [dialog, setDialog] = useState("");
  const { colors } = useThemeContext().useTheme;
  const { mangaType } = useMangaContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["home", "lastest", "manga", mangaType],
    queryFn: () => MangaAPI.list(mangaType),
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    refetch();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const parent = navigation.getParent();

    navigation.addListener("focus", () => {
      parent?.setOptions({ headerShown: true });
    });

    navigation.addListener("blur", () => {
      parent?.setOptions({ headerShown: false });
    });
  }, []);

  function onClickLink(id: string) {
    navigation.push("RootStackManga", { id });
  }

  function onClickChapter(mangaId: string, chapterId: string) {
    navigation.push("RootStackMangaChapter", { mangaId, chapterId });
  }

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  return (
    <>
      <MangaDialog content={dialog} onDismiss={() => setDialog("")} />
      <CustomFlatList
        className="p-4"
        data={data.data}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 32 }}
        columnWrapperStyle={{ gap: 16 }}
        ItemSeparatorComponent={() => <SBHeight />}
        emptyItem
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          if (!item) {
            return <View key={index} className="flex-1" />;
          }

          return (
            <View
              key={index}
              className="flex-1 border-2 rounded overflow-hidden"
              style={{ borderColor: colors.border }}
            >
              <TouchableWithoutFeedback
                onPress={() => onClickLink(item._id)}
                onLongPress={() => setDialog(item._id)}
              >
                <View className="cursor-pointer">
                  <ImageThumnail id={item._id} maxHeight={170} />
                  <Text
                    className="font-bold px-1.5 py-1"
                    style={{ fontSize: 16, color: colors.text }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {`${item.title}\n`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <FlatList
                className="px-2 pb-1"
                data={item.chapters}
                keyExtractor={(item) => item._id}
                renderItem={({ item: child, index }) => {
                  return (
                    <View
                      key={index}
                      className="flex flex-row justify-between items-center"
                      style={{ columnGap: 8 }}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => onClickChapter(item._id, child._id)}
                      >
                        <Text
                          className="cursor-pointer font-semibold flex-1"
                          style={{ fontSize: 16, color: colors.text }}
                          numberOfLines={1}
                          ellipsizeMode="head"
                        >
                          {child.chapter < 0
                            ? "One shot"
                            : `Ch ${child.chapter}`}
                        </Text>
                      </TouchableWithoutFeedback>
                      <Text
                        className="italic text-slate-500"
                        style={{ fontSize: 12 }}
                      >
                        {tsFromNow(child.time)}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          );
        }}
      />
    </>
  );
}
