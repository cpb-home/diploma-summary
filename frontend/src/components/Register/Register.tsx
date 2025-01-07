import React, { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = {
      email,
      password,
      name,
      contactPhone,
      role: 'client',
    };

    try {
      fetch(import.meta.env.VITE_CLIENT + 'register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then(res => res.json())
        .then(res => {
          if (res.statusCode === 200) {
            setEmail('');
            setPassword('');
            setName('');
            setContactPhone('');
            setReplyMessage(res.message);
            
            const interval = setInterval(() => {
              setCounter(current => current - 1);
            }, 1000);

            setTimeout(() => {
              setReplyMessage('');
              setCounter(5);
              clearInterval(interval);
              navigate('/account/', { state: {page: 'account'} });
            }, 5000);
          }
        })
        .catch(e => {
          setReplyMessage('Catch error: ' + e);
          setTimeout(() => {
            setReplyMessage('');
          }, 5000);
        });
    } catch (e) {
      setReplyMessage('Catch from try: ' + e);
      setTimeout(() => {
        setReplyMessage('');
      }, 5000);
    }
  }

  const inputStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'name':
        setName(e.target.value);
        break;
      case 'contactPhone':
        setContactPhone(e.target.value);
        break;
    }
  }

  return (
    <div className="auth__cont">
      <div className="addUser__message">{replyMessage !== '' ? replyMessage + '. Переход на страницу авторизации через ' + counter : ''}</div>
      <h2>Регистрация</h2>
      <p>Чтобы бронировать номера, требуется регистрация. Заполните форму ниже</p>
      <form className="auth__form" onSubmit={submitHandler}>
        <Input text="Введите email*" type="email" name="email" required={true} setState={inputStateHandler} value={email} placeholder="email" />
        <Input text="Введите пароль*" type="password" name="password" required={true} setState={inputStateHandler} value={password} placeholder="Пароль" />
        <Input text="Введите ваше имя*" type="text" name="name" required={true} setState={inputStateHandler} value={name} placeholder="Имя"/>
        <Input text="Введите контактный телефон" type="text" name="contactPhone" setState={inputStateHandler} value={contactPhone} placeholder="Телефон" />
        <Button type="submit" text="Зарегистрироваться" handler={() => {}} />
      </form>
    </div>
  )
}

export default Register;
