import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { IRoomListItem } from "../../models/interfaces";

const BookPage = () => {
  const { state } = useLocation();
  const { roomId, startDate, finDate } = JSON.parse(state.data);
  const [room, setRoom] = useState<IRoomListItem | null>(null);
  const [error, setError] = useState();

  useEffect(() => {
    if (roomId) {
      fetch(import.meta.env.VITE_COMMON_ROOM_INFO + roomId)
        .then(res => res.json())
        .then(result => setRoom(result))
        .catch(e => setError(e.message))
    }
  }, [roomId]);

  return (
    <div>
      Book page {room?.description}<br />
      {room?.hotel.title}<br />
      {error && 'Error: ' + {error}}<br />
      start {startDate}<br />
      fin {finDate}
    </div>
  )
}

export default BookPage
