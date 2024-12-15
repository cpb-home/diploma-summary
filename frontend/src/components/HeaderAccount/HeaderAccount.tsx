import { MouseEventHandler, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { isTokenValid } from "../../assets/isTokenValid";
import { adminMenuItems, authMenuItems, clientMenuItems, managerMenuItems } from "../../assets/linksList";

const HeaderAccount = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [headerMarker, setHeaderMarker] = useState('header__account-marker');

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
      }
    })
    
    if (!currentUser.isAuthenticated) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      dispatch(clearCurrentUser());
      setHeaderMarker('header__account-marker');
    } else {
      setHeaderMarker('header__account-marker bgcGreen');
    }
  }, [dispatch, currentUser]);

  const logOutHandler: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();

    dispatch(clearCurrentUser());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    navigate('/account/', { state: {page: 'account'} });
  };

  if (currentUser.isAuthenticated) {
    return (
      <div className="header__accountCont">
        <div className={headerMarker}></div>
        <div className="header__account__submenuCont">
{/* для админа */}
        {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin') 
          && adminMenuItems.map((e, i) => 
          <Link 
            key={i}
            className="header__account__submenuItem" 
            to={e.link}
            state={e.state?e.state:''}>
              {e.text}
          </Link>)
        }

{/* для менеджера */}
        {(currentUser.role === 'manager') && managerMenuItems.map((e, i) => 
          <Link 
            key={i}
            className="header__account__submenuItem" 
            to={e.link}
            state={e.state?e.state:''}>
              {e.text}
          </Link>)
        }

{/* для пользователя */}
        {(currentUser.role === 'client') && clientMenuItems.map((e, i) => 
          <Link 
            key={i}
            className="header__account__submenuItem" 
            to={e.link}
            state={e.state?e.state:''}>
              {e.text}
          </Link>)
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
      <div className={headerMarker}></div>
      <div className="header__account__submenuCont">
        {authMenuItems.map((e, i) => 
          <Link 
            key={i}
            className="header__account__submenuItem" 
            to={e.link}
            state={e.state?e.state:''}>
              {e.text}
          </Link>)
        }
      </div>
    </div>
  )
}

export default HeaderAccount;

/*
admin
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

client
        {currentUser.role === 'client' 
          && <Link 
            className="header__account__submenuItem" 
            to={'/bookings/'} 
            state={{page: ''}}>
              Брони
            </Link>
          }
          {currentUser.role === 'client' 
          && <Link 
            className="header__account__submenuItem" 
            to={'/'} 
            state={{page: 'support'}}>
              Поддержка
            </Link>
          }

manager
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

all
        <Link className="header__account__submenuItem" to={'/account/'} state={{page: 'account'}}>Вход</Link>
        <Link className="header__account__submenuItem" to={'/account/'} state={{page: 'register'}}>Регистрация</Link>
*/