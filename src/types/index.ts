export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}

export interface ProjectRequest {
  title: string;
  description: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}
