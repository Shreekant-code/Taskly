import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      
      minlength: 8,
    },

     googleId: String,
    photoUrl: {
      type: String, 
      default: null,
    },
    profession: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
   
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);


const User = mongoose.model("User", userSchema);

export default User;
