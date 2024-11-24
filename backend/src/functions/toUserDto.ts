import { UserDto } from "src/interfaces/dto/user.dto"
import { FromBaseUser } from "src/interfaces/fromBaseUser";

export const toUserDto = (data: FromBaseUser): UserDto => {
  const { _id, email, role } = data;

  const userDto: UserDto = {
    id: _id,
    email,
    role,
  };

  return userDto;
}