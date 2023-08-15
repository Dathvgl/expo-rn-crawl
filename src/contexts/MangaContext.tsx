import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { MangaOrder, MangaSort, MangaType } from "~/types/manga";

const MangaContext = createContext<{
  mangaType: MangaType;
  setMangaType: Dispatch<SetStateAction<MangaType>>;
}>({ mangaType: "nettruyen", setMangaType: () => {} });

export const mangaTypes: { name: string; type: MangaType; icon: string }[] = [
  { name: "Nettruyen", type: "nettruyen", icon: "" },
  { name: "Blogtruyen", type: "blogtruyen", icon: "" },
];

export const useMangaContext = () => useContext(MangaContext);

export function MangaProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [mangaType, setMangaType] = useState<MangaType>("blogtruyen");

  return (
    <MangaContext.Provider value={{ mangaType, setMangaType }}>
      {children}
    </MangaContext.Provider>
  );
}

export type FilterType = {
  order: MangaOrder;
  sort: MangaSort;
  tags: string[];
  keyword?: string;
};

const MangaSearchContext = createContext<{
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}>({
  filter: { order: "desc", sort: "lastest", tags: [] },
  setFilter: () => {},
});

export const useMangaSearchContext = () => useContext(MangaSearchContext);

export function MangaSearchProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [filter, setFilter] = useState<FilterType>({
    order: "desc",
    sort: "lastest",
    tags: [],
  });

  return (
    <MangaSearchContext.Provider value={{ filter, setFilter }}>
      {children}
    </MangaSearchContext.Provider>
  );
}
