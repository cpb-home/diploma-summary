import { useEffect, useState } from "react";
import { IRoomListItem } from "../../models/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import Button from "../../ui/Button";

type IHotelListItemProps = {
  title: string;
  description: string | undefined;
  id: string;
}

const HotelListItem = (props: IHotelListItemProps) => {
  const { title, description, id } = props;
  const [rooms, setRooms] = useState<IRoomListItem[]>([]);
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_COMMON + 'hotels/' + id + '/rooms/0/0')
      .then(res => res.json())
      .then(res => setRooms(res));
  }, [id, currentUser])

  const changeHotelHandler = () => {
    navigate('/change/', {state: {id, itemType: 'hotel'}});
  }
  

  return (
    <>
      <Link className="hotelList__link" to={`/hotels/search/`} state={{hotelId: id}}>
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
      </Link>
      {currentUser.isAuthenticated && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin') && 
        <div className="hotelsList__item-adminCont">
          <Button text="Изменить" type="button" handler={changeHotelHandler} />
        </div>
      }
    </>
  )
}

export default HotelListItem
