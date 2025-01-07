import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { io, Socket } from "socket.io-client";

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

//const socket = io('http://localhost:3000');
const ENDPOINT = 'http://localhost:3000';

const ChatClient = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);

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

    if (currentUser.id) {
      getUserMessagesList(currentUser.id);
    }

    const socketInstance = io(ENDPOINT, {
      query: { userId: currentUser.id, userRole: currentUser.role},
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  }, []);

  // useEffect для СОКЕТОВ
  useEffect(() => {
      if (socket) {
        socket.connect();
  
        socket.on('message', () => {
          //console.log('Новое сообщение: ', message);
          if (currentUser.id) {
            getUserMessagesList(currentUser.id);
          }
        });

        return () => {
          socket.off('message');
          socket.disconnect();
        };
      }
    }, [socket]);

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
            setTimeout( ()=> {
              scrollToBottom();
            }, 300);
          } else {
            console.log(`Message: ${res.message}`);
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    } catch (e) {
      console.log('Catch from try: ' + e);
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
            socket.emit('message', {text: messageInput.trim(), replyUserId: null}, function() {
              //console.log('Результат отправки: ', text);
            });
            setMessageInput('');
            socket.emit('requestMessagesList', currentUser.id, function(text: Message[]) {
              setMessageList(text);
            });
          }
          if (currentUser.id) {
            getUserMessagesList(currentUser.id);
          }
        }
      });
    }
  };

  const areaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  }

  const scrollToBottom = () => {
    const chatList = document.querySelector('.support__chatCont-list');
    if (chatList) {
      chatList.scrollTo({
        top: chatList.clientHeight ,
        behavior: 'smooth'
      });
    }
};

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
    </div>
  );
}

export default ChatClient;
