import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Ensure this matches your `users` collection name
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors", // Ensure this matches your `doctors` collection name
      required: true,
    },
    date: {
      type: String, // Using string for flexibility (e.g., "YYYY-MM-DD")
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending", // Default value for the status field
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const appointmentModel = mongoose.model("appointments", appointmentSchema); // Model name should match collection name
export default appointmentModel;
