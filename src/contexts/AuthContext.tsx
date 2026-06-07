import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import authService from "../features/auth/services/auth.service";
import type {
  AuthUserResponseDTO,
  LoginRequestDTO,
  PublicCreateUserDTO,
} from "../features/auth/models/auth.model";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../services/floraSenseApi";
import socketService from "../services/socket.service";
import { SyncService } from "../services/sync.service";
import NetInfo from "@react-native-community/netinfo";
import { runMigrations } from "../database/migrations";

interface AuthContextData {
  user: AuthUserResponseDTO | null;
  isLoading: boolean;
  signIn: (data: LoginRequestDTO) => Promise<void>;
  signUp: (data: PublicCreateUserDTO) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (
    updatedData: Partial<AuthUserResponseDTO>,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      await runMigrations();

      const storedUser = await authService.getStoredUser();
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (storedUser && token) {
        setUser(storedUser);
        socketService.connect(token);

        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
          SyncService.performIncrementalSync();
        }
      }
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(data: LoginRequestDTO) {
    const loggedUser = await authService.login(data);
    setUser(loggedUser);

    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      socketService.connect(token);
      SyncService.performIncrementalSync();
    }
  }

  async function signUp(data: PublicCreateUserDTO) {
    const newUser = await authService.register(data);
    setUser(newUser);

    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) socketService.connect(token);
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
    socketService.disconnect();
    await SyncService.wipeLocalData();
  }

  async function updateUserProfile(updatedData: Partial<AuthUserResponseDTO>) {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
