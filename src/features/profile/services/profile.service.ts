import { floraSenseApi } from "../../../services/floraSenseApi";
import type { UserProfile } from "../models/profile.model";

class ProfileService {
  async updateProfile(
    name: string,
    email: string,
    avatarUrl?: string,
  ): Promise<UserProfile> {
    const { data } = await floraSenseApi.patch<UserProfile>("/users/self", {
      name,
      email,
    });
    return data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await floraSenseApi.patch("/users/self/password", {
      currentPassword,
      newPassword,
    });
  }
}

export default new ProfileService();
