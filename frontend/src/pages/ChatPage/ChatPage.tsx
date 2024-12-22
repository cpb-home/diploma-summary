import { useEffect } from "react";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { useNavigate } from "react-router-dom";
import ChatClient from "../../components/Chat/ChatClient";
import ChatManager from "../../components/Chat/ChatManager";

const ChatPage = () => {
  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    })
  }, [currentUser, dispatch, navigate]);

  return (
    <div className="container">
      <div className="main__cont">
        <h1>Техническая поддержка</h1>
        {currentUser.role === 'client' && <ChatClient />}
        {currentUser.role === 'manager' && <ChatManager />}
      </div>
    </div>
  )
}

export default ChatPage;
