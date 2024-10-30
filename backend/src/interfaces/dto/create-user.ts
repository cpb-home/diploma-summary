export interface CreateUserDto {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
}
