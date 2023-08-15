import { imageAsset } from "asset";
import React from "react";
import { Image, View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { SBHeight, SBWidth } from "~/components/SizeBox";
import { mangaTypes, useMangaContext } from "~/contexts/MangaContext";
import { useThemeContext } from "~/contexts/ThemeContext";

export default function SettingScreen() {
  const { colors } = useThemeContext().useTheme;
  const { mangaType, setMangaType } = useMangaContext();

  return (
    <View className="p-2">
      <Text className="font-bold text-xl">Manga Type</Text>
      <SBHeight size={2} />
      <View>
        <View
          className="flex flex-row flex-wrap"
          style={{ columnGap: 8, rowGap: 10 }}
        >
          {mangaTypes.map((item, index) => {
            const active = mangaType == item.type;

            return (
              <Chip
                key={index}
                mode="outlined"
                selectedColor={active ? "white" : undefined}
                style={{ backgroundColor: active ? colors.primary : undefined }}
                onPress={
                  active
                    ? undefined
                    : () => {
                        setMangaType(item.type);
                      }
                }
              >
                <Image
                  style={{ width: 15, height: 15 }}
                  source={imageAsset[item.type]}
                />
                <SBWidth size={2} />
                {item.name}
              </Chip>
            );
          })}
        </View>
      </View>
    </View>
  );
}
