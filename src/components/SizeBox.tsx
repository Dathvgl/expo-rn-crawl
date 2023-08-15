import { View } from "react-native";

export function SBWidth({ size = 4 }: { size?: number }) {
  return <View style={{ width: 0.25 * size * 16 }} />;
}

export function SBHeight({ size = 4 }: { size?: number }) {
  return <View style={{ height: 0.25 * size * 16 }} />;
}
