import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks"
import { IUserInfo } from "../../models/interfaces";
import { isTokenValid } from "../../assets/isTokenValid";
import { clearCurrentUser } from "../../redux/slices/currentUser";

const Account = () => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkToken() {
      if (await isTokenValid()) {
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("userId");
        if (id && token) {
          try {
            fetch(import.meta.env.VITE_COMMON + 'user/' + id, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(res => {
                setUserInfo({email: res.email, role: res.role, name: res.name, contactPhone: res.contactPhone});
              })
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        dispatch(clearCurrentUser());
      }
    }
    checkToken();
  }, []);

  return (
    <div className="auth__cont">
      <h2>Ваши данные</h2>
      {userInfo && 
        <div className="info__table">
          <div className="info__table-row">
            <div className="info__table-cell">Имя: </div>
            <div className="info__table-cell">{userInfo.name}</div>
          </div>
          <div className="info__table-row">
            <div className="info__table-cell">E-mail: </div>
            <div className="info__table-cell">{userInfo.email}</div>
          </div>
          {userInfo.contactPhone && 
            <div className="info__table-row">
              <div className="info__table-cell">Номер телефона: </div>
              <div className="info__table-cell">{userInfo.contactPhone}</div>
            </div>
          }
        </div>
      }

    </div>
  )
}

export default Account
