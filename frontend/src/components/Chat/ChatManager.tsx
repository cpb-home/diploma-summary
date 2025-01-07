import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
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

const ENDPOINT = 'http://localhost:3000';

const ChatManager = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [areaDisabled, setAreaDisabled] = useState(true);
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [supportUsers, setSupportUsers] = useState<ISupportUser[] | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [newMessageAppeared, setNewMessageAppeared] = useState(0);
  const readMsgsRef = useRef<string[]>([]);

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

    getUsersWithUnread();
    if (userId) {
      setAreaDisabled(false);
    }

    const socketInstance = io(ENDPOINT, {
      query: { userId: currentUser.id, userRole: currentUser.role},
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    }
  }, [currentUser, newMessageAppeared]);

  // useEffect для СОКЕТОВ
  useEffect(() => {
    if (socket) {
      socket.connect();

      socket.on('message', () => {
        //console.log('New message: ', message + (newMessageAppeared + 1));
        if (userId) {
          getUserMessagesList(userId);
        }
        setNewMessageAppeared((prev) => ++prev);
      });

      return () => {
        socket.off('message');
        socket.disconnect();
      };
    }
  }, [socket]);

  const getUsersWithUnread = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const role = currentUser.role ?? '';
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      headers.append('X-Roles', role);
      fetch(import.meta.env.VITE_COMMON + 'support-requests/usersWithUnread', {
        method: 'GET',
        credentials: 'include',
        headers,
      })
        .then(res => res.json())
        .then(res => {
          if (res.statusCode !== 404) {
            setSupportUsers(res);
          } else {
            console.log(`Message: ${res.message}`);
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    } catch (e) {
      console.log('Catch from try: ' + e);
    }
  };

  const getUserMessagesList = (id: string): void => {
    try {
      const token = localStorage.getItem('accessToken');
      const role = currentUser.role ?? '';
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      headers.append('X-Roles', role);
      fetch(import.meta.env.VITE_COMMON + 'support-requests/' + id + '/messages', {
        method: 'GET',
        credentials: 'include',
        headers,
      })
        .then(res => res.json())
        .then(res => {
          if (res.statusCode !== 404) {
            setMessageList(res);
            setUserId(id);
            setAreaDisabled(false);
          } else {
            console.log(`Message: ${res.message}`);
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    } catch (e) {
      console.log('Catch from try: ' + e);
    }
  };

  const makeMessagesRead = () => {
    if (readMsgsRef.current.length !== 0) {
      try {
        const token = localStorage.getItem('accessToken');
        const role = currentUser.role ?? '';
        const headers = new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        headers.append('X-Roles', role);
        const body = {msgsList: readMsgsRef.current};
        fetch(import.meta.env.VITE_COMMON + 'support-requests/makeMessages/read', {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify(body),
        })
          .then(res => res.json())
          .then(res => {
            if (res.statusCode !== 404) {
              readMsgsRef.current = [];
              
                getUsersWithUnread();
                setMessageList([]);
                if (userId) {
                  getUserMessagesList(userId);
                }
            } else {
              console.log(`Message: ${res.message}`);
            }
          })
          .catch(e => console.log('Catch error: ' + e));
      } catch (e) {
        console.log('Catch from try: ' + e);
      }
    }
  };

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
          if (socket) {
            socket.emit('message', {text: messageInput.trim(), replyUserId: userId}, function() {
              //console.log('Результат отправки: ', text);
            });
            setMessageInput('');
          }
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

    getUserMessagesList(String(id));
    readMsgsRef.current = [];
  }

  const collectReadMsgs = (msgId: string, index: number): void => {
    if (!readMsgsRef.current.includes(msgId)) {
      if (!messageList[index].readAt) {
        readMsgsRef.current.push(msgId);
      }
    }

    if (index === messageList.length - 1) {
      if (readMsgsRef.current.length > 0) {
        makeMessagesRead();
      }
      
      setTimeout( ()=> {
        scrollToBottom();
      }, 300);
    }
  };

  const scrollToBottom = () => {
    const chatList = document.querySelector('.support__chatCont-list');
    
    if (chatList) {
      chatList.scrollTo({
        top: 1000 + chatList.clientHeight ,
        behavior: 'smooth'
      });
    }
};

  return (
    <div className="support__cont">
      <div className="support__chatCont">
        <h3>Список сообщений</h3>
        <div className="support__chatCont-list">
          {messageList.length > 0 && 
            messageList.map((e, i) => {
              collectReadMsgs(e.id, i);
              return (
                <p className={e.author.id === currentUser.id ? 
                  "support__chatCont-listItemGrey" : 
                  "support__chatCont-listItem"} key={i}><strong>{e.author.name}: </strong><br />{e.text}
                </p>
              );
            }) 
          }{ messageList.length <= 0 && 'Сообщений нет'}
        </div>
        <hr />
        <form className="support__chatCont-inputCont" onSubmit={sendMessage}>
          <textarea name="messageInput" required={true} onChange={areaHandler} value={messageInput} placeholder="Введите текст сообщения" disabled={areaDisabled}></textarea>
          <Button type="submit" text="Отправить сообщение" handler={() => {}} />
        </form>
      </div>
      <div className="support__usersCont">
        <h3>Список пользователей</h3>
        <div className="support__usersCont-list">
          {supportUsers && supportUsers.map((e, i) => <a className={e.unreadCount>0 ? "support__usersCont-listItem bold" : "support__usersCont-listItem"} onClick={linkHandler} href="#" title={e.id} key={i}>{e.name} <sup>({e.unreadCount})</sup></a>)}
        </div>
      </div>
    </div>
  );
}

export default ChatManager;