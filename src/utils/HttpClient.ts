import axios, { AxiosInstance } from "axios";
import { NODE_SERVER } from "@env";
import { Platform } from "react-native";

class HttpClient {
  instance: AxiosInstance;

  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL:
        baseUrl ?? NODE_SERVER?.includes("localhost")
          ? Platform.OS == "web"
            ? NODE_SERVER
            : "http://10.0.2.2:8080"
          : NODE_SERVER,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const httpClient = new HttpClient().instance;
