import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import {
  Dialog,
  DialogProps,
  Portal,
  SegmentedButtons,
  Text,
  TouchableRipple,
} from "react-native-paper";
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOutRight,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MangaAPI from "~/apis/MangaAPI";
import {
  FilterType,
  useMangaContext,
  useMangaSearchContext,
} from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";
import { RootStack } from "~/navigations/RootStack";
import { MangaSort, MangaTagClient } from "~/types/manga";
import { CustomInputSearch } from "./Input";
import { SBHeight } from "./SizeBox";

type FilterTag =
  | {
      data: MangaTagClient[];
      total: number;
    }
  | null
  | undefined;

function SearchDialog(
  props: Omit<DialogProps, "children"> & {
    tags: FilterTag;
    filter: FilterType;
    setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  }
) {
  const { tags, filter, setFilter, ...rest } = props;
  const { height } = useWindowDimensions();
  const { colors } = useThemeContext().useTheme;

  return (
    <Portal>
      <Dialog {...rest} style={{ backgroundColor: "white" }}>
        <Dialog.ScrollArea
          style={{
            height: height * 0.6,
            borderColor: "transparent",
          }}
        >
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 16, justifyContent: "space-between" }}
            ItemSeparatorComponent={() => <SBHeight />}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View className="bg-white">
                <SegmentedButtons
                  density="medium"
                  value={filter.sort}
                  onValueChange={(value) => {
                    setFilter((state) => ({
                      ...state,
                      sort: value as MangaSort,
                    }));
                  }}
                  buttons={[
                    {
                      value: "lastest" as MangaSort,
                      label: "Lastest",
                      uncheckedColor: "rgb(1,1,1)",
                    },
                    {
                      value: "chapter" as MangaSort,
                      label: "Chapter",
                      uncheckedColor: "rgb(1,1,1)",
                    },
                    {
                      value: "name" as MangaSort,
                      label: "Name",
                      uncheckedColor: "rgb(1,1,1)",
                    },
                  ]}
                />
                <SBHeight />
              </View>
            }
            numColumns={2}
            data={tags?.data}
            renderItem={({ item, index }) => {
              const check = filter.tags.includes(item._id);
              return (
                <TouchableRipple
                  key={index}
                  className="flex-1 flex flex-row items-center px-2 py-1 border rounded bg-purple-100"
                  style={{
                    backgroundColor: check
                      ? colors.primary
                      : "rgb(243,232,255)",
                  }}
                  onPress={() => {
                    if (check) {
                      setFilter((state) => ({
                        ...state,
                        tags: state.tags.filter((x) => x != item._id),
                      }));
                    } else {
                      setFilter((state) => ({
                        ...state,
                        tags: [...state.tags, item._id],
                      }));
                    }
                  }}
                >
                  <Text
                    className="font-bold text-lg"
                    style={{ color: check ? "white" : "black" }}
                  >
                    {item.name}
                  </Text>
                </TouchableRipple>
              );
            }}
          />
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

export default function SearchBar({ navigation }: { navigation: RootStack }) {
  const { colors } = useThemeContext().useTheme;
  const { mangaType } = useMangaContext();
  const { filter, setFilter } = useMangaSearchContext();

  const [isFilter, setIsFilter] = useState(false);

  const { data } = useQuery({
    queryKey: ["home", "tag", "manga", filter],
    queryFn: () => MangaAPI.tag(mangaType),
  });

  return (
    <View className="flex-1">
      <SearchDialog
        tags={data}
        filter={filter}
        setFilter={setFilter}
        visible={isFilter}
        onDismiss={() => setIsFilter(false)}
      />
      <View
        className="mx-1 flex flex-row items-center"
        style={{ columnGap: 12 }}
      >
        <View className="flex-1">
          <Animated.View
            layout={Layout.springify()}
            entering={FadeInUp}
            exiting={FadeOutUp}
          >
            <CustomInputSearch<FilterType>
              setKeyword={setFilter}
              keyboardType="web-search"
              placeholder="Search manga"
            />
          </Animated.View>
        </View>
        <Animated.View
          className="flex flex-row items-center"
          style={{ columnGap: 12 }}
          layout={Layout.springify()}
          entering={FadeInRight}
          exiting={FadeOutRight}
        >
          <TouchableRipple
            className="w-6 h-6 flex flex-row items-center justify-center"
            onPress={() => setIsFilter(true)}
          >
            <FontAwesome name="filter" size={25} color={colors.text} />
          </TouchableRipple>
          <TouchableRipple
            className="w-6 h-6 flex flex-row items-center justify-center"
            onPress={navigation.goBack}
          >
            <Ionicons name="close" size={25} color={colors.text} />
          </TouchableRipple>
        </Animated.View>
      </View>
    </View>
  );
}
