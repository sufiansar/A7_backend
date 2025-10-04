import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface IUser {
  id?: string;
  email: string;
  name: string;
  password: string;
  picture?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  blogs?: any[];
  projects?: any[];
  skills?: any[];
}
