import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { IBookingsItem } from "../../models/interfaces";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import BookingsListItem from "../../components/BookingsListItem/BookingsListItem";
import Button from "../../ui/Button";

const BookingsPage = () => {
  const { state } = useLocation();
  const [bookings, setBookings] = useState<IBookingsItem[] | null>(null);
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [reloadKey, setReloadKey] = useState(0);

  console.log(bookings)

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        if (!currentUser.isAuthenticated) {
          navigate('/account/', { state: {page: 'account'} })
        }
      }
    })

    if (replyMessage === '') {
      if (state.replyMessage && state.replyMessage !== '') {
        setReplyMessage(state.replyMessage);
        setTimeout(() => {
          setReplyMessage('');
        }, 5000);
      }
    }
    
    if (currentUser) {
      const token = localStorage.getItem("accessToken");
      const role = currentUser.role ?? '';
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
    }
    
    
  }, [currentUser, dispatch, navigate, reloadKey]);

  const deleteBookingHandler = (bookingId: string) => {
    console.log('booking no: ' + bookingId);
  
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        const token = localStorage.getItem("accessToken");
        const role = currentUser.role ?? '';
        const headers = new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        headers.append('X-Roles', role);
  
        fetch (import.meta.env.VITE_CLIENT + 'reservations/' + bookingId, {
          method: 'DELETE',
          credentials: 'include',
          headers,
        })
        .then(res => res.json())
          .then(res => {console.log(res);
            if (res.message) {
              setReplyMessage(res.message);
              setTimeout(() => {
                setReplyMessage('');
              }, 5000);
              setReloadKey(key => key +1);
            }
          })
          .catch(e => console.log('Catch error: ' + e));
      }
    })
  };

  return (
    <div className="container">
      <div className="main__cont">
        <div className="addUser__message">{replyMessage}</div>
        <h1>Ваши брони</h1>
        <div className="bookings__list">
          {bookings ? 
              bookings.length > 0 ?
                bookings.map((e, i) => 
                <div key={i}>
                  <BookingsListItem itemInfo={e} />
                  {currentUser.isAuthenticated && (currentUser.role === 'client' || currentUser.role === 'mainAdmin') && 
                    <div className="bookings__list-btnCont">
                      <Button text="Удалить бронь" type="button" handler={() => deleteBookingHandler(e.id)} />
                    </div>
                  }
                </div>
                )
              : 'Броней пока нет'
            :
            'Броней пока нет'
          }
        </div>
      </div>
    </div>
  )
}

export default BookingsPage;
