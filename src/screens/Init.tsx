import { useNavigation } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Text, View } from "react-native";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RootStack } from "~/navigations/RootStack";

export function InitScreen() {
  const navigation = useNavigation<RootStack>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate("RootStackHome");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View className="flex-1 flex-row justify-center items-center bg-green-100">
      <Text style={{ fontSize: 100 }} className="font-bold italic">
        fs
      </Text>
    </View>
  );
}

export function RootHeader({ navigation }: NativeStackHeaderProps) {
  function backIcon() {
    navigation.pop();
  }

  return (
    <View
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      className="absolute w-full p-2 z-50"
    >
      <IconFontAwesome5 onPress={backIcon} name="arrow-left" size={30} />
    </View>
  );
}
