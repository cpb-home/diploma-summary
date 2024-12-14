import { IBookingsItem } from "../../models/interfaces";
import Button from "../../ui/Button";
import { useAppSelector } from "../hooks";

interface IBookingProps {
  itemInfo: IBookingsItem;
}

const BookingsListItem = ({ itemInfo }: IBookingProps) => {
  const currentUser = useAppSelector(state => state.currentUser);

console.log(itemInfo);

const deleteBookingHandler = () => {
  console.log('booking no: ' + itemInfo.id);
};

  return (
    <div className="bookings__list-item">
      <div className="bookings__list-itemCont">
        НАДО СОЗДАТЬ КАРТОЧКУ БРОНИ
      </div>
      {currentUser.isAuthenticated && (currentUser.role === 'client' || currentUser.role === 'mainAdmin') && 
        <div className="bookings__list-btnCont">
          <Button text="Удалить бронь" type="button" handler={deleteBookingHandler} />
        </div>
      }
    </div>
  )
}

export default BookingsListItem;
