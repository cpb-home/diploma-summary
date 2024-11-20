import { CommonService } from "src/common/common.service";
import { IHotelsListItemRoom, IRoomListItem } from "src/interfaces/param-hotelsWithRooms";
import { HotelRoomDocument } from "src/schemas/hotelRoom.schema";

export default async function makeRoomWithHotelInfo(commonService: CommonService, room: HotelRoomDocument, hotelId: string): Promise<IRoomListItem> {
  const hotel = await commonService.getHotelInfo(room.hotel.toString());

  const updatedRoom: IRoomListItem = {
    _id: room._id.toString(),
    description: room.description,
    images: room.images,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    isEnabled: room.isEnabled,
    hotel: {_id: hotel._id.toString(), title: hotel.title, description: hotel.description}
  };
  
  //console.log(updatedRoom);
  return updatedRoom;
}