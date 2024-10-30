import HeaderAccount from "../HeaderAccount/HeaderAccount"
import HeaderMenu from "../HeaderMenu/HeaderMenu"

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__cont">
          <a className="header__logo-link" href="/" title="Гостиницы"></a>
          <HeaderMenu />
          <HeaderAccount />
        </div>
      </div>
    </header>
  )
}

export default Header
