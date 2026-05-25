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
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(data: LoginRequestDTO) {
    const loggedUser = await authService.login(data);
    setUser(loggedUser);
  }

  async function signUp(data: PublicCreateUserDTO) {
    const newUser = await authService.register(data);
    setUser(newUser);
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
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
