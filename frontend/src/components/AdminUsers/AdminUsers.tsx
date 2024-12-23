import React, { useEffect, useState } from "react";
import { isTokenValid } from "../../assets/isTokenValid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCurrentUser } from "../../redux/slices/currentUser";
import { IUserInfo } from "../../models/interfaces";
import { useNavigate } from "react-router-dom";
import AdminUser from "../AdminUser/AdminUser";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const AdminUsers = () => {
  const [users, setUsers] = useState<IUserInfo[] | null>(null);
  const [addUser, setAddUser] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [passwordConf, setPasswordConf] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const currentUser = useAppSelector(state => state.currentUser);

  useEffect(() => {
    async function checkToken() {
      if (await isTokenValid()) {
        const token = localStorage.getItem("accessToken");
        const role = currentUser.role ?? '';
        const headers = new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        headers.append('X-Roles', role);
        if (currentUser.isAuthenticated && token) {
          const link = currentUser.role === 'manager' ? import.meta.env.VITE_MANAGER : import.meta.env.VITE_ADMIN;
          try {
            fetch(link + 'users', {
              method: 'GET',
              credentials: 'include',
              headers,
            })
              .then(res => res.json())
              .then(res => {
                setUsers(res);
              })
          } catch (e) {
            setUsers(null);
            console.log(e);
          }
        }
      } else {
        setUsers(null);
        dispatch(clearCurrentUser());
        navigate('/account/', { state: {page: 'account'} });
      }
    }
    checkToken();

    if (password !== passwordConf) {
      setMessage('Пароль не совпадает с подтверждением')
    } else {
      setMessage('');
    }
  }, [addUser, passwordConf, currentUser, password, dispatch, navigate, role]);

  const addUserHandler = () => {
    setAddUser(true);
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if ((password === passwordConf) && await isTokenValid()) {
    const token = localStorage.getItem("accessToken");
    const currentRole = currentUser.role ?? '';
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    headers.append('X-Roles', currentRole);
      const dataToSend = {
        email,
        password,
        role,
        name,
        contactPhone: phone,
      };

      try {
        fetch(import.meta.env.VITE_ADMIN + 'users', {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify(dataToSend),
        })
          .then(res => res.json())
          .then(res => {
            if (res.message) {
              setReplyMessage(res.message);
              setTimeout(() => {
                setReplyMessage('');
              }, 5000);
            }
            if (res.statusCode !== 400) {
              setEmail('');
              setPassword('');
              setRole('');
              setName('');
              setPhone('');
              setPasswordConf('');
            }
          })
          .catch(e => console.log('Catch error: ' + e));
      } catch (e) {
        console.log('Catch from try: ' + e);
      }
    }
    setTimeout(() => {
      setAddUser(false);
    }, 100);
  }

  const inputStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else if (e.target.name === 'name') {
      setName(e.target.value);
    } else if (e.target.name === 'passwordConf') {
      setPasswordConf(e.target.value);
    } else if (e.target.name === 'phone') {
      setPhone(e.target.value);
    }
  }

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  }
  
  return (
    <div className="userslist__cont">
      <div className="addUser__message">{replyMessage}</div>
      {(currentUser.role === 'admin' || currentUser.role === 'mainAdmin') && !addUser && 
        <div className="addUserBtn__cont">
          <Button text="Добавить пользователя" type="button" handler={addUserHandler} />
        </div>
      }
      {addUser && 
        <div className="addUser__cont">
          <h5>Добавление нового пользователя</h5>
          <form className="addUser__form" onSubmit={submitHandler}>
            <div className="addUser__form-message">{message}</div>
            <Input name="name" type="text" required={true} text="Имя" setState={inputStateHandler} value={name} />
            <Input name="password" type="password" required={true} text="Пароль" setState={inputStateHandler} value={password}/>
            <Input name="passwordConf" type="password" required={true} text="Подтверждение пароля" setState={inputStateHandler} value={passwordConf} />
            <Input name="email" type="email" required={true} text="E-mail" setState={inputStateHandler} value={email} />
            <Input name="phone" type="text" text="Телефон" setState={inputStateHandler} value={phone} />
            <label className="inputLabel__select"> Роль пользователя
              <select name="role" onChange={selectHandler} value={role} required>
                <option value="" disabled>Надо выбрать роль</option>
                <option value="client">Гость</option>
                <option value="manager">Менеджер</option>
                <option value="admin">Администратор</option>
              </select>
            </label>
            <Button type="submit" text="Добавить" handler={() => {}} />
          </form>
        </div>
      }
      {!addUser && <h2>Список имеющихся пользователей</h2> }
      {users 
        ? users.length > 0
            ? users.map((e, i) => <AdminUser key={i} email={e.email} number={i+1}/>)
            : <div>Пользователи не обнаружены</div>
        : <div>Не удалось загрузить пользователей</div>
      }











        
        
        
        
        
      
    </div>
  )
}

export default AdminUsers
