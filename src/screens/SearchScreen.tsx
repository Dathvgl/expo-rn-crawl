import { useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";
import MangaAPI from "~/apis/MangaAPI";
import { ImageThumnail } from "~/components/Image";
import { SBHeight } from "~/components/SizeBox";
import {
  useMangaContext,
  useMangaSearchContext,
} from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import { RootStack } from "~/navigations/RootStack";
import { tsFromNow } from "~/utils/Date";
import MangaDialog from "./components/Dialog";

export default function SearchScreen() {
  const navigation = useNavigation<RootStack>();

  const { colors } = useThemeContext().useTheme;
  const { mangaType } = useMangaContext();
  const { filter } = useMangaSearchContext();

  const didMountRef = useRef(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState("");

  const { data, isLoading, isError, refetch, hasNextPage } = useInfiniteQuery({
    queryKey: ["search", "manga", mangaType, JSON.stringify(filter)],
    queryFn: () =>
      MangaAPI.list(
        mangaType,
        filter.sort,
        filter.order,
        page,
        filter.keyword,
        filter.tags
      ),
    getNextPageParam: (lastPage) => lastPage?.canNext,
  });

  useEffect(() => {
    if (!didMountRef) return;
    if (didMountRef.current) refetch();
    else didMountRef.current = true;
  }, [page, JSON.stringify(filter)]);

  function onClickLink(id: string) {
    navigation.push("RootStackManga", { id });
  }

  function onClickChapter(mangaId: string, chapterId: string) {
    navigation.push("RootStackMangaChapter", { mangaId, chapterId });
  }

  function customLength(
    list: { _id: string; chapter: number; time: number }[]
  ) {
    const limit = 3;
    const length = list.length;

    if (length == 3) return list;
    const result = limit - length;

    const array: { _id: string; chapter: number; time: number }[] = [];
    for (let index = 0; index < result; index++) {
      array.push({ _id: `empty-${index}`, chapter: 0, time: 0 });
    }

    return [...list, ...array];
  }

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  return (
    <>
      <MangaDialog content={dialog} onDismiss={() => setDialog("")} />
      <FlatList
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={<SBHeight />}
        ItemSeparatorComponent={() => (
          <View
            className="my-4 h-0.5"
            style={{ backgroundColor: colors.border }}
          />
        )}
        onEndReached={() => {
          if (hasNextPage) setPage((state) => state++);
        }}
        onEndReachedThreshold={0.1}
        data={data.pages.map((item) => item?.data ?? []).flat()}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableRipple
            key={index}
            onPress={() => onClickLink(item._id)}
            onLongPress={() => setDialog(item._id)}
          >
            <View className="flex flex-row px-4" style={{ height: 180 }}>
              <View className="w-1/3 rounded border overflow-hidden">
                <ImageThumnail id={item._id} />
              </View>
              <View className="flex-1 px-2">
                <Text
                  className="font-bold px-1.5 py-1"
                  style={{ fontSize: 16, color: colors.text }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {`${item.title}\n`}
                </Text>
                <View className="flex-1 px-4 py-2">
                  <Text
                    className="text-justify"
                    style={{ color: colors.text }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>
                <FlatList
                  className="px-2 pb-1"
                  ListHeaderComponent={
                    <View
                      className="my-1 h-0.5"
                      style={{ backgroundColor: colors.primary }}
                    />
                  }
                  keyExtractor={(item) => item._id}
                  data={customLength(item.chapters)}
                  renderItem={({ item: child, index }) => {
                    if (child._id.includes("empty")) {
                      return (
                        <View key={index}>
                          <Text style={{ fontSize: 16, color: "transparent" }}>
                            Empty
                          </Text>
                        </View>
                      );
                    }

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
            </View>
          </TouchableRipple>
        )}
      />
    </>
  );
}
