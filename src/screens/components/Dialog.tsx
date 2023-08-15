import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Chip, Dialog, DialogProps, Portal, Text } from "react-native-paper";
import MangaAPI from "~/apis/MangaAPI";
import { SBHeight } from "~/components/SizeBox";
import { useMangaContext } from "~/contexts/MangaContext";
import { numberFormat } from "~/utils/Number";

type CustomDialogProps = Omit<DialogProps, "visible" | "children">;

function DialogDetail(props: CustomDialogProps & { content: string }) {
  const { content, ...rest } = props;
  const { height } = useWindowDimensions();
  const { mangaType } = useMangaContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["detail", "manga", "modal", content, mangaType],
    queryFn: () => MangaAPI.detail(content, mangaType),
  });

  useEffect(() => {
    refetch();
  }, [content]);

  function onClickTag(id: string) {}

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  return (
    <Portal>
      <Dialog
        {...rest}
        visible={content ? true : false}
        style={{ backgroundColor: "white" }}
      >
        <Dialog.ScrollArea
          style={{ maxHeight: height * 0.6, borderColor: "transparent" }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-justify font-bold text-base">
              {data.title}
            </Text>
            <SBHeight />
            <View className="flex flex-row justify-between">
              <Text>Lượt xem:</Text>
              <Text>{numberFormat(data.watched)}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text>Lượt theo dõi:</Text>
              <Text>{numberFormat(data.followed)}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text>Tình trạng:</Text>
              <Text>{data.status}</Text>
            </View>
            <View
              className="flex flex-row flex-wrap my-4 justify-between"
              style={{ columnGap: 8, rowGap: 10 }}
            >
              {data.tags.map((item, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => onClickTag(item._id)}
                >
                  {item.name}
                </Chip>
              ))}
            </View>
            <Text className="text-justify">{data.description}</Text>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

export default function MangaDialog(
  props: CustomDialogProps & { content: string }
) {
  const { content } = props;
  if (!content) return <></>;
  return <DialogDetail {...props} />;
}
