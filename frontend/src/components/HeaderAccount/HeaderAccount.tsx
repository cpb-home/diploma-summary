import { MouseEventHandler, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { isTokenValid } from "../../assets/isTokenValid";

const HeaderAccount = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
      }
    })
  }, [dispatch]);

  const logOutHandler: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();

    dispatch(clearCurrentUser());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
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
              to={'/'}>
                Гостиницы
            </Link>
          }
          {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')
            && <Link 
              className="header__account__submenuItem" 
              to={'/hotels/search/'}
              state={{hotelId: ''}} >
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
