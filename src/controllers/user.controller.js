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
    // throw new ApiError(500, error.message);
    return res.status(500).json({message: error.message || "something went wrong while generating access and refresh tokens"})
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
      [fullname, email, password, role].some((field) => field?.trim() === "")
    ) {
      // throw new ApiError(404, "all fields are required");
      return res.status(404).json({message: "all fields are required"})
    }

    if (!phone) {
      // throw new ApiError(400, "Invalid phone number!");
      return res.status(400).json({message: "Invalid phone number!"})
    }

    const isUserExist = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (isUserExist) {
      // throw new ApiError(409, "user already exists");
      return res.status(409).json({message: "user already exists"});
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
      // throw new ApiError(
      //   500,
      //   "something went wrong while registering the user"
      // );
      return res.status(500).json({message: "something went wrong while registering the user"})
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    // throw new ApiError(500, error.message);
    return (
      res.status(500),
      json({ message: error.message || "something went wrong" })
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if ([email, password, role].some((field) => field.trim() === "")) {
      // throw new ApiError(400, "username or password is required");
      return res
        .status(400)
        .json({ message: "username or password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // throw new ApiError(404, "username not found");
      return res.status(404).json({ message: "username not found" });
    }

    if (user.role != role) {
      // throw new ApiError(404, "username with given role not found");
      return res
        .status(404)
        .json({ message: "username with given role not found" });
    }

    const checkPassword = await user.isPasswordCorrect(password);

    if (!checkPassword) {
      // throw new ApiError(404, "Invalid password");
      return res.status(404).json({ message: "Invalid Password" });
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "something went wrong" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({message: error.message || "something went wrong"})
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      // throw new ApiError(404, "user not fetched");
      return res.status(404).json({message: "user not fetched"});
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "current user fetched successfully")
      );
  } catch (error) {
    // throw new ApiError(500, error.message);
    return res.status(500).json({message: error.message || "something went wrong"})
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
