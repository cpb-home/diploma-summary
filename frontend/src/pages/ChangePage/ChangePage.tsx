import { useLocation, useNavigate } from "react-router-dom";
import ChangePageItem from "../../components/ChangePageItem/ChangePageItem";
import { IChangePage } from "../../models/interfaces";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { useEffect } from "react";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";

const ChangePage = () => {
  const { state } = useLocation();
  const {id, itemType}: IChangePage = state;
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
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
  }, [currentUser, dispatch, navigate]);

  return (
    <div className="container">
      <div className="changePage__cont">
        <h1>Страница изменения</h1>
        {(itemType && id) ? <ChangePageItem itemType={itemType} id={id} /> : <h3>Ошибка: Не удалось определить параметр для изменения.</h3>}
      </div>
    </div>
  );

}

export default ChangePage;