import { Types } from "mongoose";
import { CommonService } from "src/common/common.service";
import { GetRoomDto } from "src/interfaces/dto/get_room";
import { ResponseRoomWithHotelDto } from "src/interfaces/dto/response-roomWithHotel";

/**
 * Функция формирует информацию о номере с включённой инорфмацией о гостинице
 * @param commonService сервис для обращения к базе
 * @param room текущая комната, к которой добавляем данные о гостинице
 * @returns возвращает объект комнаты с данными о гостинице ResponseRoomWithHotelDto
 */
export default async function makeRoomWithHotelInfo(commonService: CommonService, room: GetRoomDto): Promise<ResponseRoomWithHotelDto> {
  const hotel = await commonService.getHotelInfo(new Types.ObjectId(room.hotel));

  const updatedRoom: ResponseRoomWithHotelDto = {
    id: room._id.toString(),
    description: room.description ? room.description : '',
    images: room.images,
    hotel: {id: hotel._id.toString(), title: hotel.title, description: hotel.description ? hotel.description : 'Нет описания'},
  };
  
  return updatedRoom;
}