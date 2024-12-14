import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { IBookingsItem } from "../../models/interfaces";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import BookingsListItem from "../../components/BookingsListItem/BookingsListItem";

const BookingsPage = () => {
  const { state } = useLocation();
  const [bookings, setBookings] = useState<IBookingsItem[] | null>(null);
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [replyMessage, setReplyMessage] = useState<string>('');

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        if (!currentUser.isAuthenticated || !(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')) {
          navigate('/account/', { state: {page: 'account'} })
        }
      }
    })

    if (state.replyMessage && state.replyMessage !== '') {
      setReplyMessage(state.replyMessage);
      setTimeout(() => {
        setReplyMessage('');
      }, 5000);
    }
    
    const token = localStorage.getItem("accessToken");
    //const role = currentUser.role ?? '';
    const role = 'client';
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    headers.append('X-Roles', role);

    fetch (import.meta.env.VITE_CLIENT + 'reservations/' + currentUser.id, {
      method: 'GET',
      credentials: 'include',
      headers,
    })
    .then(res => res.json())
      .then(res => {
        if (!res.statusCode) {
          setBookings(res);
        }
      })
      .catch(e => console.log('Catch error: ' + e));
    
  }, [currentUser, dispatch, navigate]);

  return (
    <div className="container">
      <div className="main__cont">
        <div className="addUser__message">{replyMessage}</div>
        <h1>Ваши брони</h1>
        <div className="bookings__list">
          {bookings ? 
              bookings.map((e, i) => <BookingsListItem key={i} itemInfo={e} />)
            :
            'Броней пока нет'
          }
        </div>
      </div>
    </div>
  )
}

export default BookingsPage;
