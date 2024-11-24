import { Link } from "react-router-dom"

const HeaderAccount = () => {


  return (
    <div className="header__accountCont">
      <div className="header__account__submenuCont">
{/* для админа */}
        <Link className="header__account__submenuItem" to={'/'}>Гостиницы</Link>
        <Link className="header__account__submenuItem" to={'/'}>Номера</Link>
        <Link className="header__account__submenuItem" to={'/'}>Пользователи</Link>

{/* для манагера */}
        <Link className="header__account__submenuItem" to={'/'}>Обращения</Link>
        <Link className="header__account__submenuItem" to={'/'}>Пользователи</Link>
        <Link className="header__account__submenuItem" to={'/'}>Брони</Link>

{/* для пользователя */}
        <Link className="header__account__submenuItem" to={'/'}>Брони</Link>
        <Link className="header__account__submenuItem" to={'/'}>Поддержка</Link>

{/* для всех */}
        <Link className="header__account__submenuItem" to={'/'}>Вход</Link>
        <Link className="header__account__submenuItem" to={'/'}>Регистрация</Link>
        <Link className="header__account__submenuItem" to={'/'}>Аккаунт</Link>
        <Link className="header__account__submenuItem" to={'/'}>Выход</Link>
      </div>
    </div>
  )
}

export default HeaderAccount
