export interface CreateUserDto {
  email: string;
  passwordHash: string;
  name: string;
  contactPhone?: string;
  role: string;
}
