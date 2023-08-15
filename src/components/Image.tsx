import { useQuery } from "@tanstack/react-query";
import { Image, ImageProps, View } from "react-native";
import { Text } from "react-native-paper";
import MangaAPI from "~/apis/MangaAPI";
import { useMangaContext } from "~/contexts/MangaContext";
import useImageAspectRatio from "~/hooks/ImageAspect";

export function ImageAutoHeight(props: ImageProps & { maxHeight?: number }) {
  const { maxHeight, ...rest } = props;
  const { uri } = rest.source as { uri: string };

  const aspectRatio = useImageAspectRatio(uri);
  if (!uri) return <></>;

  return (
    <Image
      {...rest}
      style={{
        width: "100%",
        height: maxHeight,
        aspectRatio: maxHeight ? undefined : aspectRatio,
      }}
      onError={(error) => console.error(error.nativeEvent.error)}
    />
  );
}

export function ImageThumnail(props: { id: string; maxHeight?: number }) {
  const { id, maxHeight } = props;
  const { mangaType } = useMangaContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga", "thumnail", id, mangaType],
    queryFn: () => MangaAPI.thumnail(id, mangaType),
  });

  if (isLoading) return <></>;
  if (isError || !data)
    return (
      <View
        className="bg-slate-400 flex items-center justify-center"
        style={{ height: maxHeight ?? 170 }}
      >
        <Text className="text-lg font-bold italic">No image</Text>
      </View>
    );

  return <ImageAutoHeight maxHeight={maxHeight} source={{ uri: data.src }} />;
}
