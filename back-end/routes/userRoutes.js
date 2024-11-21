import multer from 'multer';
import express from 'express';

// Import controllers using ES module syntax
import {
  registerController,
  loginController,
  authController,
  docController,
  deleteallnotificationController,
  getallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  downloadDocController,
} from '../controllers/userC.js';  // Ensure the correct file extension

// Import middleware using ES module syntax
import authmiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getuserdata", authController);

router.post("/registerdoc",  docController); //for doctor registration

router.post("/getappointment", appointmentController);

router.get("/getalldoctors",  getAllDoctorsControllers);

router.post("/getallnotification", authmiddleware, getallnotificationController);

router.post("/deleteallnotification", deleteallnotificationController);

router.get("/getuserappointments",  getAllUserAppointments);

router.get("/getDocsforuser",  getDocsController)

router.get("/documents/download/:filename",  downloadDocController);


export default router;


