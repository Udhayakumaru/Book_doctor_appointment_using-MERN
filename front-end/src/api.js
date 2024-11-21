import axios from 'axios';

// Set your backend URL here
const API_URL = 'http://localhost:5000/api/users';  // Replace with your production URL later

// Function to fetch the list of doctors from the backend
export const getDoctors = async () => {
    try {
        const response = await axios.get(`${API_URL}/doctors`);  // GET request to the /doctors route
        return response.data;  // Return the data (list of doctors)
    } catch (error) {
        console.error('Error fetching doctors:', error);  // Log any errors
    }
};

// Function to send a POST request to book an appointment
export const bookAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(`${API_URL}/appointments`, appointmentData);  // POST request to the /appointments route
        return response.data;  // Return the response (appointment details)
    } catch (error) {
        console.error('Error booking appointment:', error);  // Log any errors
    }
};
