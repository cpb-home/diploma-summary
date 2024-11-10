import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchHotels } from "../../redux/slices/hotelsList";
import Pagination from "../Pagination/Pagination";

const ROWS_PER_PAGE = 10;
const getTotalPageCount = (rowCount: number): number => Math.ceil(rowCount / ROWS_PER_PAGE);

const HotelsList = () => {
  const hotelsList = useAppSelector(state => state.hotelsList);
  const hotelsState = useAppSelector(state => state.hotelsListState);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const sortedHotels = [...hotelsList.hotels].sort((a, b) => a.title > b.title ? 1 : -1);
  // .slice((page - 1) * 10, 10)
  
  useEffect(() => {
    dispatch(fetchHotels());
  }, []);

  const handleNextPageClick = useCallback(() => {
    const current = page;
    const next = current + 1;
    const total = hotelsList.hotels ? getTotalPageCount(hotelsList.hotels.length) : current;

    setPage(next <= total ? next : current);
  }, [page, hotelsList.hotels]);

  const handlePrevPageClick = useCallback(() => {
    const current = page;
    const prev = current - 1;

    setPage(prev > 0 ? prev : current);
  }, [page]);

  return (
    <section className="hotelList__section">
      <div>
        {
          !hotelsState.loading ? 
            hotelsList.hotels.length === 0 ? 'Пока в базе нет гостиниц. Заходите попозже.' : 
          <ul>
            { 
              sortedHotels.map((e, i) => <li key={i}>{e.title}</li>)
            }
          </ul>
          : "Идёт загрузка списка гостиниц"
        }
      </div>
      {hotelsList.hotels && (
        <Pagination
          onNextPageClick={handleNextPageClick}
          onPrevPageClick={handlePrevPageClick}
          disable={{
            left: page === 1,
            right: page === getTotalPageCount(hotelsList.hotels.length)
          }}
        />
      )}
    </section>
  )
}

export default HotelsList
