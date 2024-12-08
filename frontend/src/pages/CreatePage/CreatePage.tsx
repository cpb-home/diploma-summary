import { useEffect } from "react";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { IAddPage } from "../../models/interfaces";
import CreatePageItem from "../../components/CreatePageItem/CreatePageItem";

const CreatePage = () => {
  const { state } = useLocation();
  const {hotelId, itemType}: IAddPage = state;
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
console.log(hotelId, itemType);
  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        if (!currentUser.isAuthenticated || !(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')) {
          navigate('/account/', { state: {page: 'account'} })
        }
      }
    })
  }, [currentUser.isAuthenticated, currentUser.role, dispatch, navigate]);
  
  return (
    <div className="container">
      <div className="changePage__cont">
        <h1>Страница добавления</h1>
        {(itemType && currentUser.isAuthenticated) ? <CreatePageItem itemType={itemType} hotelId={hotelId} /> : <h3>Ошибка: Не удалось определить параметр для изменения.</h3>}
      </div>
    </div>
  )
}

export default CreatePage
