import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchHotels } from "../../redux/slices/hotelsList";
import Pagination from "../Pagination/Pagination";
import { Link } from "react-router-dom";
import HotelListItem from "../HotelListItem/HotelListItem";

const ITEMS_PER_PAGE = 5;
const getTotalPageCount = (rowCount: number): number => Math.ceil(rowCount / ITEMS_PER_PAGE);

const HotelsList = () => {
  const hotelsList = useAppSelector(state => state.hotelsList);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const sortedHotels = [...hotelsList.hotels].sort((a, b) => a.title > b.title ? 1 : -1).slice((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE*page);
  
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
          !hotelsList.loading ? 
            hotelsList.hotels.length !== 0 ?  
              <div className="hotelsList__list">
                { 
                  sortedHotels.map((e, i) => 
                    <Link className="hotelList_link" key={i} to={`/hotels/search/${e._id}`}>
                      <HotelListItem title={e.title} description={e.description} rooms={e.availableRooms.length} />
                    </Link>
                  )
                }
              </div> : 
            hotelsList.error ? hotelsList.error : 'Пока в базе нет гостиниц. Заходите попозже.'
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
          nav={{current: page, total: getTotalPageCount(hotelsList.hotels.length)}}
        />
      )}
    </section>
  )
}

export default HotelsList
