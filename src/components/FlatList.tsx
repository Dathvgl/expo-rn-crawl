import { FlatList, FlatListProps } from "react-native";

export default function CustomFlatList<T>({
  numColumns = 1,
  data,
  emptyItem,
  ...rest
}: FlatListProps<T | null> & { numColumns: number; emptyItem?: boolean }) {
  function formatData(data: ArrayLike<T | null> | null | undefined) {
    if (!data || numColumns == 1 || !emptyItem) return data;

    const list: (T | null)[] = data as (T | null)[];
    const fullRows = Math.floor(data.length / numColumns);
    let lastRow = data.length - fullRows * numColumns;

    while (lastRow != numColumns && lastRow != 0) {
      list.push(null);
      lastRow += 1;
    }

    return list;
  }

  return <FlatList {...rest} data={formatData(data)} numColumns={numColumns} />;
}
