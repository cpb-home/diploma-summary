import { MouseEventHandler, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCurrentUser, setCurrentUser } from "../../redux/slices/currentUser";

const HeaderAccount = () => {
  const currentUser = useAppSelector(state => state.currentUser);
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
      }
    }
    checkToken();
  }, []);

  const logOutHandler: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();

    dispatch(clearCurrentUser());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    navigate('/account/', { state: {page: 'account'} })
  };

  if (currentUser.isAuthenticated) {
    return (
      <div className="header__accountCont">
        <div className="header__account__submenuCont">
{/* для админа */}
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin') 
            && <Link 
              className="header__account__submenuItem" 
              to={'/'} 
              state={{page: 'hotels'}}>
                Гостиницы
            </Link>
          }
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')
            && <Link 
              className="header__account__submenuItem" 
              to={'/'} 
              state={{page: 'rooms'}}>
                Номера
            </Link>
          }
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')
            && <Link 
              className="header__account__submenuItem" 
              to={'/account/'} 
              state={{page: 'users'}}>
                Пользователи
            </Link>
          }

{/* для менеджера */}
          {currentUser.role === 'manager' 
            && <Link 
              className="header__account__submenuItem" 
              to={'/'} 
              state={{page: 'requests'}}>
                Обращения
            </Link>
          }
          {currentUser.role === 'manager' 
            && <Link 
              className="header__account__submenuItem" 
              to={'/'} 
              state={{page: 'users'}}>
                Пользователи
            </Link>
          }
          {currentUser.role === 'manager' 
          && <Link 
            className="header__account__submenuItem" 
            to={'/'} 
            state={{page: 'books'}}>
              Брони
            </Link>
          }

{/* для пользователя */}
          {currentUser.role === 'user' 
          && <Link 
            className="header__account__submenuItem" 
            to={'/'} 
            state={{page: 'books'}}>
              Брони
            </Link>
          }
          {currentUser.role === 'user' 
          && <Link 
            className="header__account__submenuItem" 
            to={'/'} 
            state={{page: 'support'}}>
              Поддержка
            </Link>
          }

{/* для всех */}
          {<Link className="header__account__submenuItem" to={'/account/'} state={{page: 'account'}}>Кабинет</Link>}
          {<Link className="header__account__submenuItem" to={'/account/'} onClick={logOutHandler}>Выход</Link>}
        </div>
      </div>
    )
  }

  return (
    <div className="header__accountCont">
      <div className="header__account__submenuCont">
        <Link className="header__account__submenuItem" to={'/account/'} state={{page: 'account'}}>Вход</Link>
        <Link className="header__account__submenuItem" to={'/account/'} state={{page: 'register'}}>Регистрация</Link>
      </div>
    </div>
  )
}

export default HeaderAccount
