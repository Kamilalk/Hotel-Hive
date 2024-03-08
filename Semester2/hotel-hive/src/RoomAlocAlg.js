import { database } from "./firebase";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { useStaffProfile } from "./contexts/StaffProfileContext";


// Define a custom React hook to fetch rooms
export function useRoomData() {
  const { staffProfile } = useStaffProfile();
  const staffId = staffProfile.uid;
  const hotelId = staffProfile.hotelId;
  const today = new Date("2024-03-06");

  // Function to fetch all rooms
  async function getAllRooms() {
    // Reference to the rooms collection in the database
    const roomsCollectionRef = collection(database, `Hotels/${hotelId}/Rooms`);
    const usersCollectionRef = collection(database, "UserProfiles");

    try {
        const [roomsSnapshot, usersSnapshot] = await Promise.all([
            getDocs(roomsCollectionRef),
            getDocs(query(usersCollectionRef, where("hotelId", "==", hotelId)))
          ]);

        console.log("Rooms Snapshot:", roomsSnapshot.docs.map(doc => doc.data()));
        console.log("Users Snapshot:", usersSnapshot.docs.map(doc => doc.data()));  

        const rooms = [];
        const users = [];
        const housekeeperAssignments = {};
  
        roomsSnapshot.forEach((doc) => {
          const room = doc.data();
          if (room) {
            room.id = doc.id;
        
            if (room.reservationTo && /\d/.test(room.reservationTo)) {
              const reservationToDateParts = room.reservationTo.split('.');
              const reservationToDate = new Date(
                Number(reservationToDateParts[2]),
                Number(reservationToDateParts[1]) - 1,
                Number(reservationToDateParts[0])
              );
        
              const reservationFromDateParts = room.reservationFrom.split('.');
              const reservationFromDate = new Date(
                Number(reservationFromDateParts[2]),
                Number(reservationFromDateParts[1]) - 1,
                Number(reservationFromDateParts[0])
              );
              const nights = Math.floor((today - reservationFromDate) / (1000 * 60 * 60 * 24));
        
              if (reservationToDate <= today) {
                rooms.push({ ...room, type: "departure" });
              } else if (nights % 3 === 0) {
                rooms.push({ ...room, type: "linenChange" });
              } else {
                rooms.push(room);
              }
            }
          }
        });

        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          if (user.role === "Housekeeper") {
            users.push({
              id: doc.id,
              fullName: user.fullName,
              assignedRooms: [],
              assignedBeds: 0
            });
          }
        });
    
        console.log("Users:", users);
        // Count the total number of assigned beds for each housekeeper
        const assignedBedsPerHousekeeper = {};
        users.forEach(user => {
          assignedBedsPerHousekeeper[user.id] = 0;
        });

        // Assign rooms to housekeepers in a round-robin fashion
        let currentIndex = 0;
        rooms
          .filter(room => room.type === "departure" || room.type === "linenChange")
          .sort((a, b) => a.beds - b.beds)
          .forEach(room => {
            const housekeeperId = users[currentIndex].id;

            // Assign the room to the current housekeeper
            if (!housekeeperAssignments[housekeeperId]) {
              housekeeperAssignments[housekeeperId] = [];
            }
            housekeeperAssignments[housekeeperId].push(room);

            // Update the assigned beds for the current housekeeper
            assignedBedsPerHousekeeper[housekeeperId] += room.beds;

            // Move to the next housekeeper in a round-robin fashion
            currentIndex = (currentIndex + 1) % users.length;
          });

          console.log("Distribution of rooms among housekeepers:");
          Object.entries(housekeeperAssignments).forEach(([housekeeperId, assignedRooms]) => {
            const housekeeper = users.find(user => user.id === housekeeperId);
            console.log(`Housekeeper: ${housekeeper.fullName}`);
            assignedRooms.forEach(room => {
              console.log(`Room ${room.roomNumber}`);
            });
          });

      return { housekeeperAssignments, users };

    } catch (error) {
      console.error("Error fetching rooms: ", error);
      throw error; // Re-throw the error for error handling in components
    }
  }

  return {
    getAllRooms
  };
}