import express from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/authMiddleware.js';  // Use the .js extension
import {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController
} from '../controllers/doctorC.js';  // Use the .js extension


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/updateprofile", authMiddleware, updateDoctorProfileController);

router.get( "/getdoctorappointments", authMiddleware, getAllDoctorAppointmentsController);

router.post("/handlestatus", authMiddleware, handleStatusController);

router.get("/getdocumentdownload", authMiddleware, documentDownloadController);


export default router;

