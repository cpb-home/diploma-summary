import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IRoomListItem } from "../../models/interfaces";
import Button from "../../ui/Button";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser, setCurrentUser } from "../../redux/slices/currentUser";
import { getCurrentUser } from "../../assets/getCurrentUser";

const RoomInfoPage = () => {
  const { state } = useLocation();
  const { roomId, startDate, finDate } = JSON.parse(state.data);
  const [room, setRoom] = useState<IRoomListItem | null>(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();

  const updatedStartDate = new Date(startDate);
  const updatedFinDate = new Date(finDate);
  const dateDiff = (updatedFinDate.getTime() - updatedStartDate.getTime())/1000/60/60/24;

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
      } else {
        getCurrentUser().then(res => {
          try {
            dispatch(setCurrentUser({email: res?.email, role: res?.role, id: res?.id, contactPhone: res?.contactPhone, name: res?.name}))
          } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            dispatch(clearCurrentUser());
          }
        })
      }
    })

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
  }, [roomId, currentUser, navigate, dispatch]);

  const bookHandler = () => {
    isTokenValid().then(res => {
      // теоретически, ПРОВЕРИТЬ ЕЩЕ РАЗ НЕ ЗАРЕГАН ЛИ НОМЕР.
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
      } else {
        const token = localStorage.getItem("accessToken");
        const data = {   
        userId: currentUser.id,
        hotelId: room?.hotel.id,
        roomId: roomId,
        dateStart: startDate,
        dateEnd: finDate
      }
      
      //const role = currentUser.role ?? '';
      const role = 'client';
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      headers.append('X-Roles', role);

      fetch (import.meta.env.VITE_CLIENT + 'reservations', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(data)
      })
      .then(res => res.json())
        .then(res => {console.log(res);
          if (res.statusCode !== 400) {
            navigate('/bookings/', { state: {replyMessage: res.message} });
          }
        })
        .catch(e => console.log('Catch error: ' + e));
      }
    })
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
                  <span className="bold">Выбранные даты: </span><br />Заезд: {updatedStartDate.toLocaleDateString()}. Выезд {updatedFinDate.toLocaleDateString()}. Всего ночей: {dateDiff}
                </div>
              }
              { startDate && finDate && 
                (currentUser.isAuthenticated ? <Button text="Забронировать" type="button" handler={bookHandler} /> : <Link to={`/account/`} state={{page: 'account'}}>Вы не авторизованы. Авторизуйтесь, чтобы забронировать номер.</Link>)
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

export default RoomInfoPage
