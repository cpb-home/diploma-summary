import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { io } from "socket.io-client";

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

const ChatClient = () => {
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

    socket.connect();
    
    socket.on('message', (message: string) => {
      console.log(message);
    });

    socket.emit('requestMessagesList', currentUser.id, function(text: Message[]) {
      setMessageList(text);
    });

    return () => {
      socket.close();
    }
  }, []);

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
          socket.emit('message', {text: messageInput.trim(), userId: currentUser.id, managerId: null}, function(text: string) {
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
