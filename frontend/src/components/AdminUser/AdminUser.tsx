import { useEffect, useState } from "react"
import { IUserInfo } from "../../models/interfaces";
import { useAppSelector } from "../hooks";

interface IProps {
  email: string;
  number: number;
}

const AdminUser = ({ email, number }: IProps) => {
  const [user, setUser] = useState<IUserInfo | null>();
  const currentUser = useAppSelector(state => state.currentUser);

  useEffect(() => {
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
  }, [currentUser.role, email])

  return (
    <div>
      { user ? 
        `${number}. Имя: ${user.name}, e-mail: ${user.email}, Роль: ${user.role} ${user.contactPhone ? ', Телефон: ' + user.contactPhone : ''
        }` : ''
      }
    </div>
  )
}

export default AdminUser
