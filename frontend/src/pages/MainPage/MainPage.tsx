import { useAppSelector } from "../../components/hooks";
import HotelsList from "../../components/HotelsList/HotelsList"
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();

  const addBtnHandler = () => {
    navigate('/add/', { state: {itemType: 'hotels'} });
  }

  return (
    <div className="container">
      <div className="main__cont">
        { currentUser.isAuthenticated && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin' ) &&
          <div className="addBtn__cont">
            <Button text="Добавить гостиницу" type="button" handler={addBtnHandler} />
          </div>
        }
        <h1>Список гостиниц</h1>
        {<HotelsList />}
      </div>
    </div>
  )
}

export default MainPage