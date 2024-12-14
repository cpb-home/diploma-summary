import { useEffect } from "react";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../../components/hooks";
import { clearCurrentUser } from "../../redux/slices/currentUser";

const ChatPage = () => {

  const currentUser = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();

  console.log(currentUser);

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
      }
    })
  }, [dispatch]);

  return (
    <div>
      Chat
    </div>
  )
}

export default ChatPage;
