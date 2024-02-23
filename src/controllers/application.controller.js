import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";

const recruiterGetAllApplications = asyncHandler(async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      throw new ApiError(
        400,
        "Job seeker is not allowed to access this resources!"
      );
    }
    const { _id } = req.user;

    const application = await Application.find({ "recruiterID.user": _id });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          application,
          "recruiter fetched all application successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const jobSeekerGetAllApplications = asyncHandler(async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      throw new ApiError(
        400,
        "Recruiter is not allowed to access this resources!"
      );
    }
    const { _id } = req.user;

    const application = await Application.find({ "jobSeekerID.user": _id });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          application,
          "jobSeeker fetched all application successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const jobSeekerDeleteApplication = asyncHandler(async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      throw new ApiError(
        400,
        "Recruiter is not allowed to access this resources!"
      );
    }
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "please insert application id");
    }
    const application = await Application.findById(id);
    if (!application) {
      throw new ApiError(404, "application not found");
    }
    const deletedApplication = await application.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedApplication,
          "job seeker deleted application successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const postApplication = asyncHandler(async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      throw new ApiError(
        400,
        "Recruiter is not allowed to access this resources!"
      );
    }

    const {name, email, coverLetter, phone, address} = req.body;
    const { jobID } = req.params;

    if (!name || !email || !coverLetter || !phone || !address || !jobID) {
      throw new ApiError(400, "all fields are required!");
    }

    const jobSeekerID = {
      user: req.user._id,
      role: "Job Seeker",
    };

    const job = await Job.findById(jobID);

    const recruiterID = {
      user: job.postedBy,
      role: "Recruiter",
    };

    const resumeLocalPath = req.file?.path;

    if (!resumeLocalPath) {
      throw new ApiError(400, "resume is missing");
    }

    const resume = await uploadOnCloudinary(resumeLocalPath);

    if (!resume.url) {
      throw new ApiError(400, "Error while uploading resume");
    }

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      resume: resume.url,
      jobSeekerID,
      recruiterID,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, application, "application posted successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  recruiterGetAllApplications,
  jobSeekerGetAllApplications,
  jobSeekerDeleteApplication,
  postApplication,
};
