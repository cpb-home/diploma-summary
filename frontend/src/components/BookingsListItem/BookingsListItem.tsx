import { IBookingsItem } from "../../models/interfaces";

interface IBookingProps {
  itemInfo: IBookingsItem;
}

const BookingsListItem = ({ itemInfo }: IBookingProps) => {
  const startDate = new Date(itemInfo.startDate);
  const finDate = new Date(itemInfo.endDate);
  const dateDiff = (finDate.getTime() - startDate.getTime())/1000/60/60/24;

  return (
    <section className="bookings__list-item">
      <div className="bookings__list-itemCont">
        {itemInfo.hotelRoom.images && 
          <div className="bookings__list-itemImgsCont">{
            itemInfo.hotelRoom.images.map((e, i) => <img src={'http://localhost:3000/api/common/files/' + e} key={i} alt="Изображение" />)
          }
          </div>
        }
        <div className="bookings__list-itemInfoCont">
          <strong>Дата заезда:</strong> <span>{startDate.toLocaleDateString()}</span><br />
          <strong>Дата выезда:</strong> {finDate.toLocaleDateString()}<br />
          <strong>Всего ночей:</strong> {dateDiff}<br />
          <strong>Описание номера:</strong> {itemInfo.hotelRoom.description}<br />
          <strong>Название гостиницы:</strong> {itemInfo.hotel.title}<br />
          <strong>Описание гостиницы:</strong> {itemInfo.hotel.description !== '' ? itemInfo.hotel.description : 'Нет описания'}<br />
        </div>
      </div>
    </section>
  )
}

export default BookingsListItem;
