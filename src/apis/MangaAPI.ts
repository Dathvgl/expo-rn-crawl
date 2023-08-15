import { AxiosError } from "axios";
import {
  MangaChapterClient,
  MangaDetailChapterClient,
  MangaDetailClient,
  MangaListClient,
  MangaOrder,
  MangaSort,
  MangaTagClient,
  MangaThumnailClient,
  MangaType,
} from "~/types/manga";
import { httpClient } from "~/utils/HttpClient";

abstract class MangaAPI {
  static async tag(type: MangaType) {
    const res = await httpClient
      .get<{ data: MangaTagClient[]; total: number }>("api/manga/tag", {
        params: { type },
      })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }

  static async thumnail(id: string, type: MangaType) {
    const res = await httpClient
      .get<MangaThumnailClient>(`api/manga/thumnail/${id}`, {
        params: { type },
      })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }

  static async image(mangaId: string, chapterId: string, type: MangaType) {
    const res = await httpClient
      .get<MangaChapterClient>(`api/manga/chapter/${mangaId}/${chapterId}`, {
        params: { type },
      })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }

  static async chapter(id: string, type: MangaType) {
    const res = await httpClient
      .get<MangaDetailChapterClient[]>(`api/manga/chapter/${id}`, {
        params: { type },
      })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }

  static async detail(id: string, type: MangaType) {
    const res = await httpClient
      .get<MangaDetailClient>(`api/manga/detail/${id}`, { params: { type } })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }

  static async list(
    type: MangaType,
    sort: MangaSort = "lastest",
    order: MangaOrder = "desc",
    page?: number,
    keyword?: string,
    tags?: string[]
  ) {
    const res = await httpClient
      .get<MangaListClient>("api/manga/list", {
        params: { type, sort, order, page, keyword, tag: tags?.join(",") },
      })
      .catch((error: AxiosError) => console.error(error));
    if (!res) return null;
    return res.data;
  }
}

export default MangaAPI;
