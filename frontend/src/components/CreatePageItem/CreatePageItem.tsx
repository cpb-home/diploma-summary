import React, { useEffect, useState } from "react"
import { IAddPage } from "../../models/interfaces"
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
/*
interface FileListItem {
  name: string;
  size: number;
  type: string;
}

interface IFormData {
  description: string;
  images: File[];
}
*/
const CreatePageItem = ({ itemType, hotelId }: IAddPage) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.currentUser);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
console.log(hotelId); console.log('*******');
  useEffect(() => {
    if (!currentUser.isAuthenticated || !(currentUser.role === 'admin' || currentUser.role === 'mainAdmin')) {
      navigate('/account/', { state: {page: 'account'} })
    }
  }, []);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (itemType === 'hotels') {
      const dataToSend = {
        title,
        description,
      };
      fetch (import.meta.env.VITE_ADMIN + itemType, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend)}
      )
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            setReplyMessage(res.message);
            setTimeout(() => {
              setReplyMessage('');
            }, 5000);
          }
          if (res.statusCode !== 400) {
            setDescription('');
            navigate('/');
            
              //navigate('/hotels/search/', { state: {hotelId: currentItem?.hotel.id} });
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    } else if (itemType === 'hotel-rooms') {
      const formData = new FormData();
      formData.append('description', description);
      
      if (selectedFiles && selectedFiles.length) {
        selectedFiles.forEach(file => {
          formData.append('file', file, file.name);
        }); 
      }
      
      fetch (import.meta.env.VITE_ADMIN + itemType + '/' + hotelId, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
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
            setDescription('');
            navigate('/hotels/search/', { state: {hotelId} });
          }
        })
        .catch(e => console.log('Catch error: ' + e));
    }
  }

  const areaChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }

  const inputStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'title') {
      setTitle(e.target.value);
    } /*else if (e.target.name === '') {
      setPassword(e.target.value);
    }*/
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /*const files = Array.from(e.target.files ?? []);

    setSelectedFiles(files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })));*/
    setSelectedFiles(Array.from(e.target.files ?? []));
  };


/*
let formData = new FormData();
            formData.append('profile-image', document.getElementById("uploadDP").value);
            fetch('http://15.207.55.233/user/helper/profile-image', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);                   
                })
                .catch(err => {
                    console.log(err);
                })
*/



  return (
    <div className="changePage__infoCont">
      {itemType === 'hotels' &&
        <>
          <h2>Добавление гостиницы</h2>
          <div className="addUser__message">{replyMessage}</div>
          <form className="addForm" onSubmit={formSubmitHandler}>
            <Input type="text" text="Название" name="title" setState={inputStateHandler} required={true} value={title} />
            <label className="addForm__label">Описание гостиницы
              <textarea className="addForm__area" name="description" value={description} onChange={areaChangeHandler} required></textarea>
            </label>
            <Button text="Добавить" type="submit" handler={() => {}} />
          </form>
        </>
      }

      {itemType === 'hotel-rooms' &&
        <>
          <h2>Добавление номера в выбранной гостинице</h2>
          <div className="addUser__message">{replyMessage}</div>
          <form className="addForm" onSubmit={formSubmitHandler} >
            <Input type="file" name="images" text="Фотографии номера" setState={handleChange} multiple={true} accept='image/*' />
            <p className="addForm__filesInfo">Выбрано файлов: {selectedFiles ? selectedFiles.length : 0}</p>
            <ul>
              {selectedFiles && selectedFiles.map(file => (
                <li key={file.name}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
              ))}
            </ul>
            <label className="addForm__label">Описание номера
              <textarea className="addForm__area" name="description" value={description} onChange={areaChangeHandler} required></textarea>
            </label>
            <Button text="Добавить" type="submit" handler={() => {}} />
          </form>
        </>
      }
    </div>
  )
}

export default CreatePageItem