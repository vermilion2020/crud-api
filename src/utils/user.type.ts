import { Statuses } from "./api.enum.ts";

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
  
export type UserDTO = Omit<User, 'id'>;

export type UserResponse = {
  status: Statuses,
  data: User | User[] | undefined,
}