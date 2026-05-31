export interface AuthUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
