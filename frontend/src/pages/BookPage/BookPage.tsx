import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { IRoomListItem } from "../../models/interfaces";
import Button from "../../ui/Button";

const BookPage = () => {
  const { state } = useLocation();
  const { roomId, startDate, finDate } = JSON.parse(state.data);
  const [room, setRoom] = useState<IRoomListItem | null>(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const updatedStartDate = new Date(startDate);
  const updatedFinDate = new Date(finDate);
  const dateDiff = finDate - startDate; console.log(dateDiff)

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      fetch(import.meta.env.VITE_COMMON + 'hotel-rooms/' + roomId)
        .then(res => res.json())
        .then(result => {
          setRoom(result);
          setLoading(false);
          return;
        })
        .catch(e => setError(e.message))
    }
  }, [roomId]);

  const bookHandler = () => {
    console.log(roomId);
  }

  return (
    <div className="container">
      <div className="search__cont">
        <h1>Информация о выбранном номере</h1>
        {loading ? <h3>Идёт загрузка данных о номере. Подождите, пожалуйста.</h3> :
          room ?
            <div className="search__roomCont">
              {room.images.length > 0 && 
                <div className="search__imagesCont">

                </div>
              }
              <div className="search__roomDescription">
                <span className="bold">Описание номера:</span><br />{room.description}
              </div>
              <div className="search__roomHotelInfo">
                <span className="bold">Гостиница:</span><br />{room.hotel.title}
              </div>
              { startDate && finDate &&
                <div className="search__roomDatesInfo">
                  <span className="bold">Выбранные даты: </span><br />Заезд: {updatedStartDate.toLocaleDateString()}<br />Выезд {updatedFinDate.toLocaleDateString()}<br />Всего ночей: {}
                </div>
              }
              { startDate && finDate &&
                <Button text="Забронировать" type="button" handler={bookHandler} />
              }
            </div>
          : 'Нет данных о номере'
        }
      </div>
      
      <br />
      {error && 'Error: ' + {error}}<br />
    </div>
  )
}

export default BookPage
