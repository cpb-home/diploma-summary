import React, { useState } from "react";
import Button from "../../ui/Button";
import RoomList from "../../components/RoomList/RoomList";


const SearchHotelPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finDate, setFinDate] = useState<Date | null>(null);

  const searchHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e?.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      startDate: HTMLInputElement,
      finDate: HTMLInputElement
    }
    setStartDate(new Date(formElements.startDate.value));
    setFinDate(new Date(formElements.finDate.value));
  }

  return (
    <div className="container">
      <div className="search__cont">
        <div className="search__formCont">
          <h3>Поиск номера по дате</h3>
          <form className="search__form" onSubmit={searchHandle}>
            <input type="date" name="startDate" required />
            <input type="date" name="finDate" required />
            <Button type="submit" text="Найти номера" handler={() => {}} />
          </form>
        </div>
        <h1>Список доступных номеров</h1>
          <RoomList startDate={startDate} finDate={finDate} />
      </div>
    </div>
  )
}

export default SearchHotelPage
