import express from "express";
import appointmentModel from "../schemas/appointmentModel.js";

const router = express.Router();

// Create an appointment route
router.post("/create", async (req, res) => {
  try {
    const { userId, doctorId, date } = req.body;

    // Validate required fields
    if (!userId || !doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields (userId, doctorId, date) are required",
      });
    }

    // Create new appointment
    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      date,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
      error: error.message,
    });
  }
});


// Get appointments by user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId parameter
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const appointments = await appointmentModel.find({ userId });

    // Check if appointments exist
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No appointments found for this user" });
    }

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;

