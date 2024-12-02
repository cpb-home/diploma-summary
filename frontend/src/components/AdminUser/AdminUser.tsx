import { useEffect, useState } from "react"
import { IUserInfo } from "../../models/interfaces";

interface IProps {
  email: string;
  number: number;
}

const AdminUser = ({ email, number }: IProps) => {
  const [user, setUser] = useState<IUserInfo | null>();

  useEffect(() => {
    if (email) {
      try {
        const token = localStorage.getItem('accessToken');
        fetch(import.meta.env.VITE_ADMIN + 'user/' + email, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(res => {
            setUser(res);
          })
      } catch (e) {
        console.log(e);
      }
    }
  }, [email])

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
