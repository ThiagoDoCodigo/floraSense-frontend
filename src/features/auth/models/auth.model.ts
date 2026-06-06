export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type TokensResponseDTO = {
  accessToken: string;
  refreshToken: string;
};

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export interface AuthUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  token: string;
}

export type AuthResponseDTO = {
  tokens: TokensResponseDTO;
  user: AuthUserResponseDTO;
};

export type PublicCreateUserDTO = {
  name: string;
  email: string;
  password: string;
};
