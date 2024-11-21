import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notification: { type: Array },
    seennotification: { type: Array},
    userId: {type:Number},
    
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
