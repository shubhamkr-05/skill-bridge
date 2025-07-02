import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true, index: true },
    avatar: { type: String },
    avatar_public_id: { type: String},
    password: { type: String, required: true },
    refreshToken: { type: String },

    role: { type: String, enum: ['mentor', 'user'], required: true },
    skills: [
      {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        lectures: { type: Number, required: true, min: 1 },
        bio: { type: String } // Add this for skill-specific description
      }
    ], // For mentors
    bio: { type: String, trim: true, maxlength: 500 },
    isVerified: { type: Boolean, default: false },

    mentorHistory: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sessionHistory: [{ type: Schema.Types.ObjectId, ref: "Session" }],
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);