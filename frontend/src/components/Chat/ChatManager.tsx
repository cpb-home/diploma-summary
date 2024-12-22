import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { ISupportUser } from "../../models/interfaces";
import Button from "../../ui/Button";

interface Message {
  id: string;
  createdAt: string;
  text: string;
  readAt: string;
  author: {
    id: string;
    name: string;
  }
}

const socket = io('http://localhost:3000');

const ChatManager = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [supportUsers, setSupportUsers] = useState<ISupportUser[] | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
console.log('supportUsers ', supportUsers);
  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        if (!currentUser.isAuthenticated || (currentUser.role !== 'manager' && currentUser.role !== 'client')) {
          navigate('/account/', { state: {page: 'account'} });
        }
      }
    });

    socket.connect();
    
    /*socket.on('message', (message: string) => {
      console.log(message);
    });*/

    socket.emit('supportUsersList', (res: ISupportUser[]) => {
      setSupportUsers(res);
    });

    return () => {
      //socket.off('message');
      //socket.close();
      socket.disconnect();
    }
    /*socket.emit('hello', 'hello from front', function(text) {
      console.log('emit message', text);
    });*/
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      console.log(message);
    });
  }, [socket]);

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (messageInput !== '') {
      isTokenValid().then(res => {
        if (!res) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userId');
          dispatch(clearCurrentUser());
          navigate('/account/', { state: {page: 'account'} })
        } else {
          socket.emit('message', {text: messageInput.trim(), userId: userId, managerId: currentUser.id}, function(text: string) {
            console.log('Результат отправки: ', text);
          });
          setMessageInput('');
        }
      });
    }
  };

  const areaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  }

  const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('title');
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      } else {
        socket.emit('requestMessagesList', id, function(text: Message[]) {
          setMessageList(text);
          setUserId(id);
        });
      }
    });
  }

  return (
    <div className="support__cont">
      <div className="support__chatCont">
        <h3>Список сообщений</h3>
        <div className="support__chatCont-list">
          {messageList.length > 0 ? messageList.map((e, i) => <p className={e.author.id === currentUser.id ? "support__chatCont-listItemGrey" : "support__chatCont-listItem"} key={i}><strong>{e.author.name}: </strong><br />{e.text}</p>) : 'Сообщений нет'}
        </div>
        <hr />
        <form className="support__chatCont-inputCont" onSubmit={sendMessage}>
          <textarea name="messageInput" required={true} onChange={areaHandler} value={messageInput} placeholder="Введите текст сообщения"></textarea>
          <Button type="submit" text="Отправить сообщение" handler={() => {}} />
        </form>
      </div>
      <div className="support__usersCont">
        <h3>Список пользователей</h3>
        <div className="support__usersCont-list">
          {supportUsers && supportUsers.map((e, i) => <a className="support__usersCont-listItem" onClick={linkHandler} href="#" title={e.id} key={i}>{e.name} <sup>({e.unreadCount})</sup></a>)}
        </div>
      </div>
    </div>
  );
}

export default ChatManager;
