import React, { useState } from 'react';
import { bookAppointment } from './api';  // Import the API call

const AppointmentForm = () => {
    const [doctorId, setDoctorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const appointmentData = {
            doctorId,
            appointmentDate,
        };

        const response = await bookAppointment(appointmentData);  // Send data to the backend to book appointment
        if (response) {
            alert('Appointment booked successfully!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Doctor:
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {/* You should dynamically populate this with doctor options from your backend */}
                </select>
            </label>
            <label>
                Date:
                <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                />
            </label>
            <button type="submit">Book Appointment</button>
        </form>
    );
};

export default AppointmentForm;
