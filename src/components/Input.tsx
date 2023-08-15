import { useEffect, useState } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";
import { useThemeContext } from "~/contexts/ThemeContext";
import useDebounce from "~/hooks/Debounce";

export function CustomInputSearch<T>(props: {
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  setKeyword: React.Dispatch<React.SetStateAction<T>>;
}) {
  const { keyboardType, placeholder, setKeyword } = props;
  const { colors } = useThemeContext().useTheme;

  const [text, setText] = useState("");
  const keyword = useDebounce<string>(text);

  useEffect(() => {
    setKeyword?.((state) => ({ ...state, keyword }));
  }, [keyword]);

  return (
    <View
      className="px-3 py-2 rounded"
      style={{ borderWidth: 1.5, borderColor: colors.border }}
    >
      <TextInput
        className="text-base"
        style={{ color: colors.text }}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        value={text}
        onChangeText={setText}
      />
    </View>
  );
}
