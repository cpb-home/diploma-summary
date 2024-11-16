type IRoomListItemProps = {
  _id: string;
  images?: string[];
  description: string | undefined;
  isEnabled: boolean;
  hotel: {
    title: string;
    description?: string;
    _id: string;
  };
}

const RoomListItem = ( props: IRoomListItemProps ) => {
  const { _id, isEnabled, hotel, images, description } = props;

  return (
    <div className="roomList">
      {_id} {description} {isEnabled ? 'enabled' : 'disabled'} {hotel.title} {hotel._id} {images}
    </div>
  )
}

export default RoomListItem
