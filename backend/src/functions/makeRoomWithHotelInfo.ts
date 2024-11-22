import { Types } from "mongoose";
import { CommonService } from "src/common/common.service";
import { IHotelsListItemRoom, IRoomListItemForFront } from "src/interfaces/param-hotelsWithRooms";
import { HotelRoomDocument } from "src/schemas/hotelRoom.schema";

export default async function makeRoomWithHotelInfo(commonService: CommonService, room: HotelRoomDocument): Promise<IRoomListItemForFront> {
  const hotel = await commonService.getHotelInfo(new Types.ObjectId(room.hotel));

  const updatedRoom: IRoomListItemForFront = {
    id: room._id.toString(),
    description: room.description ? room.description : '',
    images: room.images,
    hotel: {id: hotel._id.toString(), title: hotel.title, description: hotel.description ? hotel.description : 'Нет описания'},
  };
  
  return updatedRoom;
}