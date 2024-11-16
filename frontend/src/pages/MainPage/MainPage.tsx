import HotelsList from "../../components/HotelsList/HotelsList"

const MainPage = () => {

  return (
    <div className="container">
      <div className="main__cont">
        <h1>Список гостиниц</h1>
        {<HotelsList />}
      </div>
    </div>
  )
}

export default MainPage