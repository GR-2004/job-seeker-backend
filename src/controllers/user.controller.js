import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //steps
  //get user details from frontend
  //validation - not empty
  //check if username or email already exists or not
  //generate access and reresh tokens
  //create user object - create entry in db
  //remove password and refresh token filed from response
  //check for user creation
  //return res

  try {
    const { email, fullname, password, phone, role } = req.body;

    if (
      [fullname, email, password, role].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(404, "all fields are required");
    }

    if (!phone) {
      throw new ApiError(400, "Invalid phone number!");
    }

    const isUserExist = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (isUserExist) {
      throw new ApiError(409, "user already exists");
    }

    const user = await User.create({
      email,
      phone,
      password,
      fullname,
      role,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if ([email, password, role].some((field) => field.trim() === "")) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "username not found");
  }

  if(user.role !=  role){
    throw new ApiError(404, "username with given role not found");
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(404, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //only server can change our cookies , but cookies is visible for both frontend and backend
  const options = {
    httpOnly: true,
    secure: true,
  };

  //we can return multiple cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logout successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {

    if(!req.user){
        throw new ApiError(404, "user not fetched")
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "current user fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message)
  }
});

const changePassword = asyncHandler(async (req, res) => {});

const refreshAccessToken = asyncHandler(async (req, res) => {});

const updateUserProfile = asyncHandler(async (req, res) => {});

const getUserProfile = asyncHandler(async (req, res) => {});

const getHistory = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  changePassword,
  refreshAccessToken,
  updateUserProfile,
  getUserProfile,
  getHistory,
};
