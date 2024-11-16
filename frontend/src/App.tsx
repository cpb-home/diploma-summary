import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainPage from './pages/MainPage/MainPage'
import Layout from './components/Layout/Layout'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import SearchHotelPage from './pages/SearchHotelPage/SearchHotelPage'
import ChatPage from './pages/ChatPage/ChatPage'
import BookPage from './pages/BookPage/BookPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<MainPage />} />

        <Route path='/hotels/search/' element={<SearchHotelPage />} />
        <Route path='/search/room/' element={<BookPage />} />
        <Route path='/support/' element={<ChatPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
