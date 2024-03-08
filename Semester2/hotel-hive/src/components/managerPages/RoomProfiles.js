import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Nav from '../Nav'
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../firebase";
import { useStaffProfile } from "../../contexts/StaffProfileContext";

const RoomProfiles = () => {
    const history = useHistory();
    const [roomProfiles, setRoomProfiles] = useState([]);
    const { staffProfile } = useStaffProfile();
    const hotelId = staffProfile.hotelId; // Replace this with the actual hotel ID

    useEffect(() => {
        // Function to fetch room profiles
        async function fetchRoomProfiles() {
            try {
                const roomCollectionRef = collection(database, `Hotels/${hotelId}/Rooms`);
                const querySnapshot = await getDocs(roomCollectionRef);
                const roomProfilesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRoomProfiles(roomProfilesData);
            } catch (error) {
                console.error("Error fetching room profiles:", error);
            }
        }

        // Call the fetchRoomProfiles function when the component mounts
        fetchRoomProfiles();
    }, [hotelId]);

    return (
        <>
            <Nav fixed="top" style={{ position: 'fixed', top: 0 }} />
            <div style={{ paddingTop: '100px', height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
                <h1>Room Profiles</h1>
                <button onClick={() => history.push('/managerPages/AddRooms')}>Add Room</button>
                <button onClick={() => history.push('/managerPages/CSVUpload')}>Add Several Rooms</button>
                <div>
                    {/* Display room profiles */}
                    {roomProfiles.map(room => (
                        <div key={room.id}>
                            <h2>Room Number: {room.roomNumber}</h2>
                            <p>Floor: {room.floor}</p>
                            <p>Beds: {room.beds}</p>
                            <p>Room Type: {room.roomType}</p>
                            <p>Occupation Status: {room.occupationStatus}</p>
                            <p>Cleaning Status: {room.cleaningStatus}</p>
                            <p>Additional Notes: {room.additionalNotes}</p>
                        </div>
                    ))}
                </div>
                <button onClick={() => history.goBack()}>Back</button>
            </div>
        </>
    )
}
  
export default RoomProfiles;