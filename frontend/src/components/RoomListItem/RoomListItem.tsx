import { IRoomListItem } from "../../models/interfaces";


const RoomListItem = ( props: IRoomListItem ) => {
  const { hotel, images, description } = props;

  return (
    <div className="roomList__item">
      {images && images.length > 0 && 
        <div className="roomsList__item-imgCont">
          <img src={images[0]} alt="room image" />
        </div>
      }
      
      <div className="roomsList__item-content">
        <div className="roomsList__item-desc">
          <strong>Описание номера:</strong><br /> {description}
        </div>
        <div className="roomsList__item-descHotel">
        <strong>Гостиница:</strong> {hotel.title}
        </div>
      </div>
    </div>
  )
}

export default RoomListItem
