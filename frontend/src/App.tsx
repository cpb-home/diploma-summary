import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import Layout from './components/Layout/Layout';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ChatPage from './pages/ChatPage/ChatPage';
import AccountPage from './pages/Account/AccountPage';
import ChangePage from './pages/ChangePage/ChangePage';
import CreatePage from './pages/CreatePage/CreatePage';
import RoomInfoPage from './pages/RoomInfoPage/RoomInfoPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import SearchRoomsPage from './pages/SearchRoomsPage/SearchRoomsPage';
import ManageBookingsPage from './pages/ManageBookingsPage/ManageBookingsPage';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<MainPage />} />

        <Route path='/hotels/search/' element={<SearchRoomsPage />} />
        <Route path='/room/info/' element={<RoomInfoPage />} />
        <Route path='/support/' element={<ChatPage />} />
        <Route path='/account/' element={<AccountPage />} />
        <Route path='/change/' element={<ChangePage />} />
        <Route path='/add/' element={<CreatePage />} />
        <Route path='/bookings/' element={<BookingsPage />} />
        <Route path='/manage-bookings/' element={<ManageBookingsPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App;
