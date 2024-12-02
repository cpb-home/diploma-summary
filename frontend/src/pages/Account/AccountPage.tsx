import { useEffect } from "react";
import Account from "../../components/Account/Account"
import Auth from "../../components/Auth/Auth"
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser, setCurrentUser } from "../../redux/slices/currentUser";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "../../components/Register/Register"
import AdminUsers from "../../components/AdminUsers/AdminUsers";

const AccountPage = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkToken() {
      if (await isTokenValid()) {
        const token = localStorage.getItem("accessToken");
        const email = localStorage.getItem("email");
        if (email && token) {
          try {
            fetch(import.meta.env.VITE_AUTH + 'getrole', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({email: email}),
            })
              .then(res => res.json())
              .then(res => {
                if (email && res.role) {
                  dispatch(setCurrentUser({email, role: res.role}))
                }
              })
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      }
    }
    checkToken();
  }, []);
  return (
    

    <div className="container">
      <div className="account__cont">
        <h1>Аккаунт</h1>
        {!currentUser.isAuthenticated && state.page === 'account' && <Auth />}
        {!currentUser.isAuthenticated && state.page === 'register' && <Register />}

        {currentUser.isAuthenticated && state.page === 'account' && <Account />}
        {currentUser.isAuthenticated && state.page === 'users' && <AdminUsers />}
      </div>
    </div>
  )
}

export default AccountPage