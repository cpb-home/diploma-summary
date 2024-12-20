import { ResponseUserDto } from "src/interfaces/dto/response-user";
import { GetUserDto } from "src/interfaces/dto/get-user";

/**
 * Функция получает на вход данные о пользователе из базы и возвращает тип ResponseUserDto для фронта. Предназначена для формирования нужной информации о пользователе для фронта
 * @param data объект пользователя, полученный из базы
 * @returns объект пользователя типа ResponseUserDto
 */
export const toUserDto = (data: GetUserDto): ResponseUserDto => {
  const { _id, email, role, name, contactPhone } = data;

  const userDto: ResponseUserDto = {
    id: _id,
    email,
    role,
    name,
    contactPhone,
  };

  return userDto;
}
