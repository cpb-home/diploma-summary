import { IUserInfo } from "../models/interfaces";

export async function getCurrentUser(): Promise<IUserInfo | null> {
  const userId = localStorage.getItem('userId'); 
  const token = localStorage.getItem("accessToken");

  if (!userId || userId === '' || !token) {
    return null;
  }

  try {
    const response = await fetch(import.meta.env.VITE_COMMON + "user/" + userId, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось получить текущего пользователя, ' + response.status);
    }

    const data = await response.json(); 
    if (data) {
      return {
        id: data.id,
        name: data.name,
        contactPhone: data.contactPhone,
        email: data.email,
        role: data.role,
      };
    }
    
    return null;

  } catch (e) {
    console.log('Ошибка: ' + e);
    return null;
  }
}