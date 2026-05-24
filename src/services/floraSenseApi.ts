import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL não definida no .env");
}

export const floraSenseApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const STORAGE_KEYS = {
  USER: "@FloraSense:user",
  ACCESS_TOKEN: "@FloraSense:accessToken",
  REFRESH_TOKEN: "@FloraSense:refreshToken",
};

let inMemoryToken: string | null = null;

export const setInMemoryToken = (token: string | null) => {
  inMemoryToken = token;
};

const clearAuthData = async () => {
  inMemoryToken = null;
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
};

floraSenseApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!inMemoryToken) {
      inMemoryToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    if (inMemoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

floraSenseApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return floraSenseApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN,
        );
        if (!refreshToken) throw new Error("Refresh token não encontrado");

        const { data } = await axios.post<{
          tokens: { accessToken: string; refreshToken: string };
        }>(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        setInMemoryToken(data.tokens.accessToken);

        await AsyncStorage.setItem(
          STORAGE_KEYS.ACCESS_TOKEN,
          data.tokens.accessToken,
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          data.tokens.refreshToken,
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        }

        processQueue(null, data.tokens.accessToken);
        return floraSenseApi(originalRequest);
      } catch (refreshError) {
        const finalError = refreshError as AxiosError;
        processQueue(finalError, null);
        await clearAuthData();
        return Promise.reject(finalError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
