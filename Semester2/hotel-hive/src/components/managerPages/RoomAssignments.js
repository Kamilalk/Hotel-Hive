import React, { useEffect, useState } from 'react';
import { useRoomData } from "../../RoomAlocAlg";


function RoomAssignment() {
  const { getAllRooms } = useRoomData();
  const [housekeeperAssignments, setHousekeeperAssignments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { housekeeperAssignments } = await getAllRooms();
        setHousekeeperAssignments(housekeeperAssignments);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {Object.keys(housekeeperAssignments).map(housekeeperId => (
        <div key={housekeeperId}>
          <h2>Housekeeper: {housekeeperId}</h2>
          <ul>
            {housekeeperAssignments[housekeeperId].map(room => (
              <li key={room.id}>Room {room.roomNumber}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
  
  export default RoomAssignment;