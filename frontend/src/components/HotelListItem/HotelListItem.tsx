type IHotelListItemProps = {
  title: string;
  description: string | undefined;
  rooms: number;
}

const HotelListItem = (props: IHotelListItemProps) => {
  const { title, description, rooms } = props;

  return (
    <div className="hotelList__item">
      <header className="hotelList__item-header">
        {title}
      </header>
      <div className="hotelList__item-desc">
        {description}
      </div>
      <div className="hotelList__item-roomsAvailable">
        {rooms ? <span className="green">Всего номеров в гостинице: {rooms} шт.</span>
        : <span className="red">Гостиница не предоставляет номера частным клиентам</span>}
      </div>
    </div>
  )
}

export default HotelListItem
