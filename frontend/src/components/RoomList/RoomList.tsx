import { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchRooms } from "../../redux/slices/roomsList";
import Pagination from "../Pagination/Pagination";
import RoomListItem from "../RoomListItem/RoomListItem";

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

  const sortedRooms = [...roomsList.rooms];
  //const sortedRooms = [...roomsList.rooms].sort((a, b) => a.hotel.title.localeCompare(b.hotel.title)).slice((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE*page);

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

  console.log(roomsList);

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

  return (
    <section className="roomsList__section">
      <div>
        {
          !roomsList.loading ?
            roomsList.rooms.length !== 0 ?
              <div className="roomsList__list">
                {
                  sortedRooms.map((e, i) =>
                    <Link className="hotelList__link" key={i} to={`/search/room/`} state={{roomId: e._id}}>
                      <RoomListItem _id={e._id} description={e.description} isEnabled={e.isEnabled} hotel={e.hotel} images={e.images} />
                    </Link>
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
