import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

import appointmentModel from '../schemas/appointmentModel.js';
import docModel from '../schemas/docModel.js';
import userModel from '../schemas/userModel.js'; // Ensure this is the actual Mongoose model
dotenv.config();

// Utility to generate JWT tokens
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email }); // Correct usage of model
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ fullName, email, password: hashedPassword });

    await newUser.save();

    const token = generateToken({ id: newUser._id, email: newUser.email });
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    // Generate JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });


    user.password = undefined; // Don't include password in response

    return res.status(200).send({
      message: "Login successful",
      success: true,
      userData: user,
      token: token,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};


// Auth Controller
export const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// doctor Registration Controller
export const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docModel({ ...doctor, userId, status: 'pending' });
    await newDoctor.save();

        // Find admin user (adjust this if admin is part of userModel)
        const adminUser = await userModel.findOne({ type: 'admin' });
        if (adminUser) {
          adminUser.notification.push({
            type: 'apply-doctor-request',
            message: `${doctor.fullName} has applied for doctor registration`,
            data: { userId: newDoctor._id, fullName: doctor.fullName, onClickPath: '/admin/doctor' },
          });
          await adminUser.save();
        }
    
        res.status(201).send({ success: true, message: 'doctor registration request sent successfully' });
      } catch (error) {
        console.error('doctor Registration Error:', error.message);
        res.status(500).send({ message: 'Server error', success: false });
      }
    };
    

// Notifications Controllers
export const getallnotificationController = async (req, res) => {
  try {
    // Check if userId exists in the request body
    if (!req.body.userId) {
      return res.status(400).send({ success: false, message: 'UserId is required' });
    }

    // Fetch user by userId
    const user = await userModel.findById(req.body.userId);

    // Handle case if user is not found
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Process notifications
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    // Success response
    res.status(200).send({
      success: true,
      message: 'All notifications marked as read',
      data: user,
    });
  } catch (error) {
    console.error('Notification Error:', error); // Log the entire error object
    res.status(500).send({ message: 'Server error', success: false });
  }
};


//delete
export const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notification = [];
    user.seennotification = [];
    await user.save();

    res.status(200).send({ success: true, message: 'All notifications deleted', data: user });
  } catch (error) {
    console.error('Notification Deletion Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};


// Appointment Controllers
export const appointmentController = async (req, res) => {
  try {
    const { userId, doctorId, date } = req.body;

    // Validate required fields
    if (!userId || !doctorId || !date) {
      return res.status(400).send({
        success: false,
        message: "All fields (userId, doctorId, date) are required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid userId or doctorId format",
      });
    }

    // Create a new appointment
    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      date,
      status: "pending",
    });

    // Check if a file is uploaded
    if (req.file) {
      newAppointment.document = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    // Save the appointment
    await newAppointment.save();

    // Send success response
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Appointment Error:", error.message);

    // Send server error response
    res.status(500).send({
      success: false,
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};


// Get All doctor
export const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctor = await docModel.find({ status: 'approved' });
    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    console.error('doctor Retrieval Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Document Download Controller
export const downloadDocController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const document = user.documents.find((doc) => doc.filename === req.params.filename);

    if (!document) {
      return res.status(404).send({ success: false, message: 'Document not found' });
    }

    const filePath = path.resolve(`uploads/${document.filename}`);
    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    } else {
      res.status(404).send({ message: 'File not found', success: false });
    }
  } catch (error) {
    console.error('Document Download Error:', error.message);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

//get all user appointments
export const getAllUserAppointments = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;  // Assuming userId is sent in the body

    // Check if user exists
    const user = await userModel.findById(userId, doctorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the appointments for the user
    const appointments = await appointmentModel.find({ userId }); // Adjust according to your schema

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Get All doctor (Admin or Approved List) Controller
export const getDocsController = async (req, res) => {
  try {
    const { adminView } = req.query; // Optional adminView to fetch all doctor

    const query = adminView === 'true' ? {} : { status: 'approved' };
    const doctor = await docModel.find(query);

    if (!doctor.length) {
      return res.status(404).send({
        success: false,
        message: 'No doctor found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'doctor retrieved successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Get doctor Error:', error.message);
    res.status(500).send({
      success: false,
      message: 'Server error while retrieving doctor',
      error: error.message,
    });
  }
};

