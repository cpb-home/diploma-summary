export async function isTokenValid(): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    if (!token || !email) {
      return false;
    }

    // Отправляем GET-запрос на защищенный маршрут сервера
    const response = await fetch(import.meta.env.VITE_AUTH + "protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (email && response.ok) {
      return true;
    } else {
      console.log("токен не валиден");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");

      return false; // Сервер вернул ошибку, токен недействителен
    }
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    return false;
  }
}
