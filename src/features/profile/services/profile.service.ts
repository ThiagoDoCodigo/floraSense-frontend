import type { UserProfile } from "../models/profile.model";

class ProfileService {
  async fetchUserProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "1",
          name: "Thiago Ferreira",
          email: "thiago@flora.com",
          avatarUrl: "",
        });
      }, 1000);
    });
  }

  async updateProfile(
    name: string,
    email: string,
    avatarUrl?: string,
  ): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email) {
          reject(new Error("Dados inválidos"));
        } else {
          resolve({ id: "1", name, email, avatarUrl });
        }
      }, 1500);
    });
  }

  async changePassword(current: string, newPass: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (current === "123456") {
          resolve();
        } else {
          reject(new Error("A senha atual está incorreta."));
        }
      }, 1500);
    });
  }
}

export default new ProfileService();
