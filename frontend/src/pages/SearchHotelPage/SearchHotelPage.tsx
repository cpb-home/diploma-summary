import React, { useState } from "react";
import Button from "../../ui/Button";
import RoomList from "../../components/RoomList/RoomList";
import { useAppSelector } from "../../components/hooks";
import { useLocation, useNavigate } from "react-router-dom";


const SearchHotelPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finDate, setFinDate] = useState<Date | null>(null);
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [wrongDate, setWrongDate] = useState('');
  

  const addBtnHandler = () => {
    navigate('/add/', { state: {itemType: 'hotel-rooms', hotelId: state.hotelId} });
  }

  const searchHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWrongDate('');
    const form = e?.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      startDate: HTMLInputElement,
      finDate: HTMLInputElement
    }

    const start = new Date(formElements.startDate.value);
    const finish = new Date(formElements.finDate.value);

    if ((finish.getTime() - start.getTime()) < 1) {
      setWrongDate('Дата выезда не может быть раньше даты заезда.');
      setTimeout(() => {
        setWrongDate('');
      }, 5000);
    } else {
      setStartDate(start);
      setFinDate(finish);
    }
  }

  return (
    <div className="container">
      <div className="search__cont">
        <div className="search__formCont">
          <h3>Поиск номера по дате</h3>
          <form className="search__form" onSubmit={searchHandle}>
            <label className="inputLabel">Дата заезда
              <input type="date" name="startDate" required />
            </label>
            <label className="inputLabel">Дата выезда
              <input type="date" name="finDate" required />
            </label>
            <Button type="submit" text="Найти номера" handler={() => {}} />
          </form>
          <div className="dates__messageCont">{wrongDate}</div>
        </div>
        { currentUser.isAuthenticated && state.hotelId !== '' && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin') &&
          <div className="addBtn__cont">
            <Button text="Добавить номер" type="button" handler={addBtnHandler} />
          </div>
        }
        <h1>Список доступных номеров</h1>
          <RoomList startDate={startDate} finDate={finDate} />
      </div>
    </div>
  )
}

export default SearchHotelPage
