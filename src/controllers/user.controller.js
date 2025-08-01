import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, role, bio } = req.body;

  if ([fullName, email, username, password, role].some(field => field?.trim() === "")) {
    throw new ApiError(400, "Required fields are missing");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let avatarUploadResult = null;

  if (avatarLocalPath) {
    avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUploadResult) {
      throw new ApiError(400, "Failed to upload avatar");
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    role,
    bio: bio || "",
    avatar: avatarUploadResult?.url || "",
    avatar_public_id: avatarUploadResult?.public_id || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) throw new ApiError(400, "Username or email is required");

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password");

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true };
  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  const options = { httpOnly: true, secure: true };

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");
    if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

    const options = { httpOnly: true, secure: true };
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { fullName, bio } = req.body;

  if (fullName) user.fullName = fullName;
  if (bio) user.bio = bio;

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const getMentors = asyncHandler(async (req, res) => {
  const { skill } = req.query;

  const filter = { role: "mentor" };

  if (skill) {
    filter.$or = [
      { fullName: { $regex: skill, $options: "i" } },
      { "skills.name": { $regex: skill, $options: "i" } },
      { bio: { $regex: skill, $options: "i" } }
    ];
  }

  const mentors = await User.find(filter).select("fullName avatar skills bio");

  return res
    .status(200)
    .json(new ApiResponse(200, mentors, "Mentors fetched successfully"));
});


const getMentorById = asyncHandler(async (req, res) => {  
  const { mentorId } = req.params;

  const mentor = await User.findById(mentorId)
    .where("role")
    .equals("mentor")
    .select("-password -refreshToken");

  if (!mentor) {
    throw new ApiError(404, "Mentor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, mentor, "Mentor profile fetched"));
});

const addSkillToMentor = asyncHandler(async (req, res) => {
  const { name, price, lectures, bio } = req.body;

  if (!name || !price || !lectures || !bio) {
    throw new ApiError(400, "All fields are required (name, price, lectures, bio)");
  }

  const user = await User.findById(req.user._id);

  if (!user || user.role !== "mentor") {
    throw new ApiError(403, "Only mentors can add skills");
  }

  user.skills.push({ name, price, lectures, bio });
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, user.skills, "Skill added successfully")
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete avatar from cloudinary if present
  if (user.avatar_public_id) {
    await deleteFromCloudinary(user.avatar_public_id);
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
  generateAccessAndRefereshTokens,
  registerUser, 
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserProfile,
  getMentors,
  getMentorById,
  addSkillToMentor,
  deleteUser,
};
