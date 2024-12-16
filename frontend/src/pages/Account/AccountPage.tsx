import { useEffect } from "react";
import Account from "../../components/Account/Account"
import Auth from "../../components/Auth/Auth"
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "../../components/Register/Register"
import AdminUsers from "../../components/AdminUsers/AdminUsers";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";

const AccountPage = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res && state.page !== 'register') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      }
    })
    /*if (!currentUser.isAuthenticated) {
      navigate('/account/', { state: {page: 'account'} })
    }*/
  }, [currentUser, navigate]);

  return (
    

    <div className="container">
      <div className="account__cont">
        <h1>Личный кабинет</h1>
        {!currentUser.isAuthenticated && state.page === 'account' && <Auth />}
        {!currentUser.isAuthenticated && state.page === 'register' && <Register />}

        {currentUser.isAuthenticated && state.page === 'account' && <Account />}

        {currentUser.isAuthenticated && state.page === 'users' && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin' || currentUser.role === 'manager' ) && <AdminUsers />}

        
      </div>
    </div>
  )
}

export default AccountPage