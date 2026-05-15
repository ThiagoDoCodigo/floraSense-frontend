import type { AuthUser } from "../models/auth.model";

class AuthService {
  async login(
    email: string,
    password?: string,
  ): Promise<{ user: AuthUser; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@flora.com" && password === "123456") {
          resolve({
            user: { id: "1", name: "Admin", email },
            token: "mock-jwt-token",
          });
        } else {
          reject(
            new Error("Credenciais inválidas. Tente admin@flora.com / 123456"),
          );
        }
      }, 1500);
    });
  }

  async recoverPassword(email: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@flora.com") {
          resolve({
            message: "Um link de recuperação foi enviado para o seu e-mail.",
          });
        } else {
          reject(new Error("E-mail não encontrado em nossa base de dados."));
        }
      }, 1500);
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ user: AuthUser; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@flora.com") {
          reject(new Error("Este e-mail já está em uso."));
        } else {
          resolve({ user: { id: "2", name, email }, token: "mock-jwt-token" });
        }
      }, 1500);
    });
  }
}

export default new AuthService();
