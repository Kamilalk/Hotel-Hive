import React, { useEffect, useState } from 'react';
import { useRoomData } from "../../RoomAlocAlg";


function RoomAssignment() {
    const { getAllRooms } = useRoomData();
    const [stayoverRooms, setStayoverRooms] = useState([]);
    const [departureRooms, setDepartureRooms] = useState([]);
    const [stayoverLinenChangeRooms, setStayoverLinenChangeRooms] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { stayovers, dueOuts, stayoversLinenChange, users } = await getAllRooms();
  
          setStayoverRooms(stayovers);
          setDepartureRooms(dueOuts);
          setStayoverLinenChangeRooms(stayoversLinenChange);
          setUserProfiles(users);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h1>Stayover Rooms</h1>
        <ul>
          {stayoverRooms.map(room => (
            <li key={room.id}>Room {room.roomNumber}</li>
          ))}
        </ul>
        <h1>Stayover Rooms Requiring Linen Change</h1>
        <ul>
          {stayoverLinenChangeRooms.map(room => (
            <li key={room.id}>Room {room.roomNumber}</li>
          ))}
        </ul>
        <h1>Departure Rooms</h1>
        <ul>
          {departureRooms.map(room => (
            <li key={room.id}>Room {room.roomNumber}</li>
          ))}
        </ul>
        <h1>User Profiles</h1>
        <ul>
          {userProfiles.map(user => (
            <li key={user.id}>{user.fullName}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default RoomAssignment;