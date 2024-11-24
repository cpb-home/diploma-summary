import { useEffect, useState } from "react";
import { IRoomListItem } from "../../models/interfaces";

type IHotelListItemProps = {
  title: string;
  description: string | undefined;
  id: string;
}

const HotelListItem = (props: IHotelListItemProps) => {
  const { title, description, id } = props;
  const [rooms, setRooms] = useState<IRoomListItem[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_COMMON + 'hotels/' + id + '/rooms/0/0')
      .then(res => res.json())
      .then(res => setRooms(res));
  }, [id])
  

  return (
    <div className="hotelList__item">
      <header className="hotelList__item-header">
        {title}
      </header>
      <div className="hotelList__item-desc">
        {description}
      </div>
      <div className="hotelList__item-roomsAvailable">
        {rooms.length > 0 ? <span className="green">Всего номеров в гостинице: {rooms.length} шт.</span>
        : <span className="red">В гостинице нет номеров</span>}
      </div>
    </div>
  )
}

export default HotelListItem
