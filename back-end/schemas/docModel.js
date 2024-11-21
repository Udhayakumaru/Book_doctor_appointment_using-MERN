import mongoose from 'mongoose';

const docSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: Number,String,
      required: [true, "experience is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    clinicAddress: {
      type: String,
      required: [true, "address required"],
    },
  
  },

  {
    timestamps: true,
  }
);

const docModel = mongoose.model("doctor", docSchema);

export default docModel;
