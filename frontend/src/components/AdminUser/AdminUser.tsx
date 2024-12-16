import { useEffect, useState } from "react";
import { IUserInfo } from "../../models/interfaces";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";

interface IProps {
  email: string;
  number: number;
}

const AdminUser = ({ email, number }: IProps) => {
  const [user, setUser] = useState<IUserInfo | null>();
  const currentUser = useAppSelector(state => state.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    isTokenValid().then(res => {
      if (!res) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} })
      }
    })
    if (email) {
      try {
        const token = localStorage.getItem('accessToken');
        const role = currentUser.role ?? '';
        const headers = new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        headers.append('X-Roles', role);
        fetch(import.meta.env.VITE_ADMIN + 'user/' + email, {
          method: 'GET',
          credentials: 'include',
          headers,
        })
          .then(res => res.json())
          .then(res => {
            setUser(res);
          })
      } catch (e) {
        console.log(e);
      }
    }
  }, [currentUser.role, email]);

  return (
    <div>
      { user && (currentUser.role === 'admin' || currentUser.role === 'mainAdmin') ? 
        <div className="userList__itemCont">
          e-mail: {user.email}, {number}. Имя: {user.name}, Роль: {user.role} {user.contactPhone ? ', Телефон: ' + user.contactPhone : ''}
        </div>
      : '' }
      { user && currentUser.role === 'manager' ? 
        <div className="userList__itemCont">
          {number}. 
          <strong> e-mail:</strong> {user.email},
          <strong> Имя:</strong> {user.name}
          {user.contactPhone && <span>, <strong>Телефон:</strong> {user.contactPhone}</span>}. <Link className="userList__link" to={'/manage-bookings/'} state={{userId: user.id}}>Смотреть брони пользователя</Link>
        </div>
      : '' }
    </div>
  )
}
export default AdminUser;
