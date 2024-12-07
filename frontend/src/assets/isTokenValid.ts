export async function isTokenValid(): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return false;
    }

    const response = await fetch(import.meta.env.VITE_AUTH + "protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // const base64Url = token.split('.')[1];
      // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Преобразуем URL-safe Base64 обратно в стандартный Base64
      // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      // }).join(''));
      // const { exp } = JSON.parse(jsonPayload); // Получаем значение времени истечения срока действия
      // console.log('До истечения токена: ' + ((exp - Math.floor(Date.now() / 1000)) / 60).toFixed(1) + 'мин');
      
      return true;
    } else {
      //console.log("токен не валиден");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");

      return false;
    }
  } catch (error) {
    //console.error("Ошибка при проверке токена:", error);
    return false;
  }
}
