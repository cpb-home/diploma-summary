import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchRooms } from "../../redux/slices/roomsList";
import Pagination from "../Pagination/Pagination";
import RoomListItem from "../RoomListItem/RoomListItem";
import Button from "../../ui/Button";

interface ISearchStateProps {
  startDate: Date | null;
  finDate: Date | null;
}

const ITEMS_PER_PAGE = 5;
const getTotalPageCount = (rowCount: number): number => Math.ceil(rowCount / ITEMS_PER_PAGE);

const RoomList = (props: ISearchStateProps) => {
  const { startDate, finDate } = props;
  const { state } = useLocation();
  const roomsList = useAppSelector(state => state.roomsList);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();

  //const sortedRooms = [...roomsList.rooms];
  const sortedRooms = [...roomsList.rooms].slice((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE*page);

  useEffect(() => {
    if (startDate && finDate) {
      if (state.hotelId !== '') {
        dispatch(fetchRooms({hotelId: state.hotelId, startDate: startDate, finDate: finDate}));
      } else {
        dispatch(fetchRooms({startDate: startDate, finDate: finDate}));
      }
    } else {
      if (state.hotelId !== '') {
        dispatch(fetchRooms({hotelId: state.hotelId}));
      } else {
        dispatch(fetchRooms({}));
      }
    }
  }, [dispatch, state.hotelId, startDate, finDate]);

  const handleNextPageClick = useCallback(() => {
    const current = page;
    const next = current + 1;
    const total = roomsList.rooms ? getTotalPageCount(roomsList.rooms.length) : current;

    setPage(next <= total ? next : current);
  }, [page, roomsList.rooms]);

  const handlePrevPageClick = useCallback(() => {
    const current = page;
    const prev = current - 1;

    setPage(prev > 0 ? prev : current);
  }, [page]);

  const changeRoomHandler = (id: string) => {
    navigate('/change/', {state: {id, itemType: 'hotel-rooms'}});
  }

  return (
    <section className="roomsList__section">
      <div>
        {
          !roomsList.loading ?
            roomsList.rooms.length !== 0 ?
              <div className="roomsList__list">
                {
                  sortedRooms.map((e, i) =>
                    startDate && finDate ? 
                      <div key={i}>
                        <Link className="roomsList__link" to={`/room/info/`} state={{ data: JSON.stringify({roomId: e.id, startDate, finDate})}}>
                          <RoomListItem id={e.id} description={e.description} hotel={e.hotel} images={e.images} />
                        </Link>
                        {currentUser.isAuthenticated && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin') && 
                        <div className="roomList__item-btnCont">
                          <Button text="Изменить" type="button" handler={() => changeRoomHandler(e.id)} />
                        </div>
                        }
                      </div>
                    : 
                      <div key={i}>
                        <div className="roomList__notAlink">
                          <RoomListItem id={e.id} description={e.description} hotel={e.hotel} images={e.images} />
                          <div className="roomList__comment">Чтобы забронировать номер, выберите даты заезда и выезда.</div>
                        </div>
                        {currentUser.isAuthenticated && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin') && 
                          <div className="roomList__item-btnCont">
                            <Button text="Изменить" type="button" handler={() => changeRoomHandler(e.id)} />
                          </div>
                        }
                      </div>

                  )
                }
              </div> :
            roomsList.error ? roomsList.error : 'Пока в базе нет информации о номерах. Заходите попозже.'
          : "Идёт загрузка списка доступных номеров"
        }
      </div>
      {roomsList.rooms && (
        <Pagination
          onNextPageClick={handleNextPageClick}
          onPrevPageClick={handlePrevPageClick}
          disable={{
            left: page === 1,
            right: page === getTotalPageCount(roomsList.rooms.length)
          }}
          nav={{current: page, total: getTotalPageCount(roomsList.rooms.length)}}
        />
      )}
    </section>
  )
}

export default RoomList
