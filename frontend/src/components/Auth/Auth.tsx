import React, { useEffect, useState } from "react"
import Button from "../../ui/Button"
import Input from "../../ui/Input"
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCurrentUser } from "../../redux/slices/currentUser";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.currentUser);

  useEffect(() => {
    if (currentUser.isAuthenticated) {
      navigate('/account/', { state: {page: 'account'} })
    }
  }, [currentUser, navigate]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSend = {
      email,
      password,
    };
    try {
      fetch(import.meta.env.VITE_AUTH + 'login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then(res => res.json())
        .then(res => {
          if (res.email && res.role && res.accessToken) {
            dispatch(setCurrentUser({email: res.email, role: res.role, id: res.id}));
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('userId', res.id);
            setEmail('');
            setPassword('');
            navigate('/account/', { state: {page: 'account'} });
          }
          if (res.message) {
            console.log(`Message: ${res.message}`)
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    } catch (e) {
      console.log('Catch from try: ' + e);
    }
  }

  const inputStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  }

  return (
    <div className="auth__cont">
      <h2>Авторизация</h2>
      <p>Для входа в личный кабинет авторизуйтесь</p>
      <form className="auth__form" onSubmit={submitHandler}>
        <Input text="Введите email" type="email" name="email" required={true} setState={inputStateHandler} value={email} />
        <Input text="Введите пароль" type="password" name="password" required={true} setState={inputStateHandler} value={password} />
        <Button type="submit" text="Войти" handler={() => {}} />
      </form>
    </div>
  )
}

export default Auth
