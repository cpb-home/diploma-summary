type IHotelListItemProps = {
  title: string;
  description: string | undefined;
  rooms: number;
}

const HotelListItem = (props: IHotelListItemProps) => {
  const { title, description, rooms } = props;

  return (
    <div className="hotelList_item">
      <header className="hotelList_item-header">
        {title}
      </header>
      <div className="hotelList_item-desc">
        {description}
      </div>
      <div className="hotelList_item-roomsAvailable">
        {rooms > 0 ? `Доступно для бронирования номеров: ${rooms} шт.`: 'Нет свободных номеров'}
      </div>
    </div>
  )
}

export default HotelListItem
