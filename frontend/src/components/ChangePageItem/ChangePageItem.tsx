import React, { useEffect, useState } from "react";
import { IChangePage, IHotelsListItem } from "../../models/interfaces";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

interface currentItemInfo {
  title?: string;
  id?: string;
  description?: string;
  images: string[];
  hotel: IHotelsListItem;
}

const ChangePageItem = ({id, itemType}: IChangePage) => {
  const [currentItem, setCurrentItem] = useState<currentItemInfo | null>(null);
  const [description, setDescription] = useState('');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.currentUser);

  useEffect(() => {
    if (!currentUser.isAuthenticated || !(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')) {
      navigate('/account/', { state: {page: 'account'} })
    }
    fetch (import.meta.env.VITE_COMMON + itemType + '/' + id)
      .then(res => res.json())
      .then(res => setCurrentItem(res))
      .catch(e => console.log('Ошибка страницы изменения: ' + e))
  }, [currentUser, id, itemType, navigate]);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const role = currentUser.role ?? '';
        const headers = new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        headers.append('X-Roles', role);
    const dataToSend = {
      description,
    };

    const route = itemType === 'hotel' ? 'hotels/' : itemType === 'hotel-rooms' ? 'hotel-rooms/' : '';

    fetch (import.meta.env.VITE_ADMIN + route + id, {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: JSON.stringify(dataToSend)}
    )
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          setReplyMessage(res.message);
          setTimeout(() => {
            setReplyMessage('');
          }, 5000);
        }
        if (res.statusCode !== 400) {
          setDescription('');
          if (itemType === 'hotel') {
            navigate('/');
          } else if (itemType === 'hotel-rooms') {
            navigate('/hotels/search/', { state: {hotelId: currentItem?.hotel.id} });
          }
        }
      })
      .catch(e => console.log('Catch error: ' + e));
  }

  const areaChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }

  return (
    <div className="changePage__infoCont">
      {currentItem && itemType === 'hotel' &&
        <>
          <h2>{currentItem.title}</h2>
          <div className="addUser__message">{replyMessage}</div>
          <form className="addForm" onSubmit={formSubmitHandler}>
            <label className="addForm__label">Описание гостиницы
              <textarea className="addForm__area" name="description" value={description ? description : currentItem?.description} onChange={areaChangeHandler} required></textarea>
            </label>
            <Button text="Изменить" type="submit" handler={() => {}} />
          </form>
        </>
      }

      {currentItem && itemType === 'hotel-rooms' &&
        <>
          <h2>Номер гостиницы {currentItem.hotel.title}</h2>
          <div className="addUser__message">{replyMessage}</div>
          <form className="addForm" onSubmit={formSubmitHandler}>
            <label className="addForm__label">Описание номера
              <textarea className="addForm__area" name="description" value={description ? description : currentItem?.description} onChange={areaChangeHandler} required></textarea>
            </label>
            <Button text="Изменить" type="submit" handler={() => {}} />
          </form>
        </>
      }
    </div>
  );
}

export default ChangePageItem;
