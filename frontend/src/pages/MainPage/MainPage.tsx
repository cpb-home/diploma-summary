import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../components/hooks"
import { fetchHotels } from "../../redux/slices/hotelsList";

const MainPage = () => {
  const hotelsList = useAppSelector(state => state.hotelsList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHotels());
  }, []);

  return (
    <div className="container">
      <div className="main__cont">
        <h1>Список гостиниц</h1>

        
        {hotelsList.hotels.length === 0 ? 'Пока в базе нет гостиниц. Заходите попозже.' : 
        <ul>
          {hotelsList.hotels.map((e, i) => <li key={i}>{e.title}</li>)}
        </ul>
        }
      </div>
    </div>
  )
}

export default MainPage
/*

*/