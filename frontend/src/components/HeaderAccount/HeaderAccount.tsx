import { MouseEventHandler, useEffect } from "react";
import { Link } from "react-router-dom";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCurrentUser, setCurrentUser } from "../../redux/slices/currentUser";

const HeaderAccount = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();

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
      }
    }
    checkToken();
  }, []);

  console.log('HeaderAccount авторизован ' + currentUser.isAuthenticated);

  const logOutHandler: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();

    dispatch(clearCurrentUser());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
  };

  if (currentUser.isAuthenticated) {
    return (
      <div className="header__accountCont">
        <div className="header__account__submenuCont">
          {/* для админа */}
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin') 
            && <Link className="header__account__submenuItem" to={'/'}>Гостиницы</Link>
          }
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')
            && <Link className="header__account__submenuItem" to={'/'}>Номера</Link>
          }
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')
            && <Link className="header__account__submenuItem" to={'/'}>Пользователи</Link>
          }

          {/* для манагера */}
          {currentUser.role === 'manager' && <Link className="header__account__submenuItem" to={'/'}>Обращения</Link>}
          {currentUser.role === 'manager' && <Link className="header__account__submenuItem" to={'/'}>Пользователи</Link>}
          {currentUser.role === 'manager' && <Link className="header__account__submenuItem" to={'/'}>Брони</Link>}

          {/* для пользователя */}
          {currentUser.role === 'user' && <Link className="header__account__submenuItem" to={'/'}>Брони</Link>}
          {currentUser.role === 'user' && <Link className="header__account__submenuItem" to={'/'}>Поддержка</Link>}

          {/* для всех */}
          {<Link className="header__account__submenuItem" to={'/'}>Аккаунт</Link>}
          {<Link className="header__account__submenuItem" to={'/'} onClick={logOutHandler}>Выход</Link>}
        </div>
      </div>
    )
  }

  return (
    <div className="header__accountCont">
      <div className="header__account__submenuCont">
        {!currentUser.isAuthenticated && <Link className="header__account__submenuItem" to={'/account/'}>Вход</Link>}
        {!currentUser.isAuthenticated && <Link className="header__account__submenuItem" to={'/'}>Регистрация</Link>}
      </div>
    </div>
  )
}

export default HeaderAccount
