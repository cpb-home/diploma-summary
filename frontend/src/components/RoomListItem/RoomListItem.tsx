import { IRoomListItem } from "../../models/interfaces";


const RoomListItem = ( props: IRoomListItem ) => {
  const { hotel, images, description } = props;

  return (
    <div className="roomList__item">
      {images && images.length > 0 && 
        <div className="roomsList__item-imgCont">
          {images.map((e, i) => <img src={'http://localhost:3000/api/common/files/' + e} alt="room image" key={i} />)}
          
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
