import { UserDto } from "src/interfaces/dto/user.dto"
import { FromBaseHotel } from "src/interfaces/fromBaseHotel";
import { FromBaseUser } from "src/interfaces/fromBaseUser";

/**
 * Функция получает на вход данные о пользователе из базы и возвращает тип UserDto для фронта. Предназначена для получения инфо о пользователе на фронте
 * @param data объект пользователя, полученный из базы
 * @returns объект типа UserDto
 */
export const toUserDto = (data: FromBaseUser): UserDto => {
  const { _id, email, role, name, contactPhone } = data;

  const userDto: UserDto = {
    id: _id,
    email,
    role,
    name,
    contactPhone,
  };

  return userDto;
}
