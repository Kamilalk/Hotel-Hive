import { database } from "./firebase";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { useStaffProfile } from "./contexts/StaffProfileContext";


// Define a custom React hook to fetch rooms
export function useRoomData() {
  const { staffProfile } = useStaffProfile();
  const staffId = staffProfile.uid;
  const hotelId = staffProfile.hotelId;

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
      const rooms = [];
      const users = [];

      roomsSnapshot.forEach((doc) => {
        // doc.data() is a function to get the data from the document
        const room = doc.data();
        room.id = doc.id; // Add room ID for reference
        rooms.push(room);
      });

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.role === "Housekeeper") {
          users.push({
            id: doc.id,
            fullName: user.fullName
          });
        }
      });


      // Get today's date
      const today = new Date("2024-03-06"); // Change to new Date() to get current date

      // Separate rooms into due outs and stayovers
      const dueOuts = [];
      const stayovers = [];
      const stayoversLinenChange = [];

      rooms.forEach((room) => {
        if (room.reservationTo && /\d/.test(room.reservationTo)) { // Check if reservationTo is not null and contains a number
          const reservationToDateParts = room.reservationTo.split('.'); // Split the date string
          const reservationToDate = new Date(
            Number(reservationToDateParts[2]), // Year
            Number(reservationToDateParts[1]) - 1, // Month (January is 0 in JavaScript)
            Number(reservationToDateParts[0]) // Day
          );

          // Calculate the number of nights since reservationFrom
          const reservationFromDateParts = room.reservationFrom.split('.');
          const reservationFromDate = new Date(
            Number(reservationFromDateParts[2]),
            Number(reservationFromDateParts[1]) - 1,
            Number(reservationFromDateParts[0])
          );
          const nights = Math.floor((today - reservationFromDate) / (1000 * 60 * 60 * 24));

          if (reservationToDate <= today) {
            dueOuts.push(room);
          } else if (nights % 3 === 0) { // Check if it's the 3rd, 6th, or any subsequent third night
            stayoversLinenChange.push(room);
          } else {
            stayovers.push(room);
          }
        }
      });

      return { stayovers, dueOuts, stayoversLinenChange, users }; // Return the sorted rooms

    } catch (error) {
      console.error("Error fetching rooms: ", error);
      throw error; // Re-throw the error for error handling in components
    }
  }

  return {
    getAllRooms
  };
}