import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import {
  Chip,
  Divider,
  SegmentedButtons,
  Text,
  TouchableRipple,
} from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MangaAPI from "~/apis/MangaAPI";
import { ImageThumnail } from "~/components/Image";
import { SBHeight } from "~/components/SizeBox";
import { useMangaContext } from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import { RootStack, RootStackParamList } from "~/navigations/RootStack";
import { tsFromNow } from "~/utils/Date";
import { numberFormat } from "~/utils/Number";

export default function MangaScreen() {
  const stackRoute =
    useRoute<RouteProp<RootStackParamList, "RootStackManga">>();
  const { id } = stackRoute.params;
  const navigation = useNavigation<RootStack>();
  const { mangaType } = useMangaContext();

  const { colors } = useThemeContext().useTheme;
  const [value, setValue] = useState("content");

  const queries = useQueries({
    queries: [
      {
        queryKey: ["manga", "detail", id, mangaType],
        queryFn: () => MangaAPI.detail(id, mangaType),
      },
      {
        queryKey: ["manga", "detail", "chapter", id, mangaType],
        queryFn: () => MangaAPI.chapter(id, mangaType),
      },
    ],
  });

  useEffect(() => {
    if (queries[0].data?.title) {
      navigation.setOptions({ headerTitle: queries[0].data?.title });
    } else {
      navigation.setOptions({ headerTitle: "Loading..." });
    }
  }, [queries[0].data?.title]);

  function onClickTag(id: string) {}

  function chapterLink(mangaId: string, chapterId: string) {
    navigation.push("RootStackMangaChapter", { mangaId, chapterId });
  }

  if (queries[0].isLoading || queries[1].isLoading) return <></>;
  if (
    queries[0].isError ||
    queries[1].isError ||
    !queries[0].data ||
    !queries[1].data
  ) {
    return <></>;
  }

  const detail = queries[0].data;
  const chapters = queries[1].data;

  return (
    <FlatList
      className="p-4"
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponent={
        <>
          <Text
            className="text-lg font-bold line-clamp-2 px-2"
            style={{ color: colors.text }}
          >
            {detail.title}
          </Text>
          <SBHeight size={1} />
          <View className="flex flex-row" style={{ columnGap: 10 }}>
            <View className="flex-1 rounded overflow-hidden">
              <ImageThumnail id={detail._id} />
            </View>
            <View className="flex-1 flex flex-col" style={{ rowGap: 5 }}>
              {detail.altTitle && (
                <View
                  className="flex flex-row items-center"
                  style={{ columnGap: 8 }}
                >
                  <MaterialCommunityIcons
                    name="subtitles"
                    size={20}
                    color={colors.text}
                  />
                  <Text style={{ color: colors.text }}>{detail.altTitle}</Text>
                </View>
              )}
              {detail.authors.length != 0 && (
                <View
                  className="flex flex-row items-center"
                  style={{ columnGap: 8 }}
                >
                  <Ionicons name="person" size={20} color={colors.text} />
                  <View>
                    {detail.authors.map((item, index, { length }) => (
                      <TouchableWithoutFeedback key={index}>
                        <Text style={{ color: "darkred" }}>
                          {item.name}
                          {index == length - 1 ? "" : ", "}
                        </Text>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              )}
              <View
                className="flex flex-row items-center"
                style={{ columnGap: 8 }}
              >
                <MaterialCommunityIcons
                  name="auto-fix"
                  size={20}
                  color={colors.text}
                />
                <Text style={{ color: colors.text }}>{detail.status}</Text>
              </View>
              <View
                className="flex flex-row items-center"
                style={{ columnGap: 8 }}
              >
                <FontAwesome name="eye" size={20} color={colors.text} />
                <Text style={{ color: colors.text }}>
                  {numberFormat(detail.watched)}
                </Text>
              </View>
              <View
                className="flex flex-row items-center"
                style={{ columnGap: 8 }}
              >
                <Ionicons name="heart" size={20} color={colors.text} />
                <Text style={{ color: colors.text }}>
                  {numberFormat(detail.followed)}
                </Text>
              </View>
            </View>
          </View>
          <SBHeight size={1} />
          <View
            className="flex flex-row flex-wrap my-4 justify-between"
            style={{ columnGap: 8, rowGap: 10 }}
          >
            {detail.tags.map((item, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => onClickTag(item._id)}
              >
                {item.name}
              </Chip>
            ))}
          </View>
          <SBHeight size={1} />
          <SegmentedButtons
            density="medium"
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: "content",
                label: "Nội dung",
                uncheckedColor: colors.text,
              },
              {
                value: "chapter",
                label: "Danh sách",
                uncheckedColor: colors.text,
              },
            ]}
          />
          {value == "chapter" ? (
            <View className="flex flex-row py-2 px-4">
              <View className="flex-1">
                <Text
                  className="font-bold text-base"
                  style={{ color: colors.text }}
                >
                  Chapter
                </Text>
              </View>
              <View className="flex-1 flex flex-row justify-end">
                <Text
                  className="font-bold text-base"
                  style={{ color: colors.text }}
                >
                  Lượt xem
                </Text>
              </View>
              <View className="flex-1 flex flex-row justify-end">
                <Text
                  className="font-bold text-base"
                  style={{ color: colors.text }}
                >
                  Thời gian
                </Text>
              </View>
            </View>
          ) : (
            <>
              <SBHeight />
              <Text className="text-justify" style={{ color: colors.text }}>
                {detail.description}
              </Text>
              <SBHeight size={1} />
            </>
          )}
        </>
      }
      ItemSeparatorComponent={() => <Divider />}
      data={
        value == "content" ? [] : chapters.sort((a, b) => b.chapter - a.chapter)
      }
      renderItem={({ item, index }) => {
        return (
          <TouchableRipple
            key={index}
            onPress={() => chapterLink(detail._id, item._id)}
          >
            <View className="flex flex-row px-4 py-2">
              <View className="flex-1">
                <Text style={{ color: colors.text }}>
                  {item.chapter < 0 ? "One shot" : `Chapter ${item.chapter}`}
                </Text>
              </View>
              <View className="flex-1 flex flex-row justify-end">
                <Text style={{ color: colors.text }}>
                  {numberFormat(item.watched)}
                </Text>
              </View>
              <View className="flex-1 flex flex-row justify-end">
                <Text className="italic text-slate-500">
                  {tsFromNow(item.time)}
                </Text>
              </View>
            </View>
          </TouchableRipple>
        );
      }}
    />
  );
}
