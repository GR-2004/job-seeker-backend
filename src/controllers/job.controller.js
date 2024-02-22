import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Job } from "../models/job.model.js";


const postJob = asyncHandler( async (req, res) => {
    try {

        if(req.user.role === "Job Seeker"){
            throw new ApiError(400, "Job seeker can not post a job")
        }

        const {title, description, category, location, salary, requiredExperience, requiredSkills, employmentType} = req.body

        if([title, description, category, location, employmentType].some((field) => field.trim() === "")){
            throw new ApiError(400, "All fields are required!")
        }

        if(!salary && !requiredExperience && !requiredSkills){
            throw new ApiError(400, "All fields are required!")
        }

        const job = await Job.create({
            title,
            description,
            category,
            location,
            salary,
            requiredExperience,
            requiredSkills,
            employmentType,
            postedBy: req.user.fullname
        })

        if(!job){
            throw new ApiError(500, "something went wrong while creating a job")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(201, job, "job posted successfully")
        )

    } catch (error) {
        throw new ApiError(500, error.message)
    }
})


const getMyJob = asyncHandler(async (req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getAllJobs = asyncHandler( async (req, res) => {
    try {
        const jobs = await Job.find({expired: false})

        return res
        .status(200)
        .json(
            new ApiResponse(200, jobs, "jobs fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message);
    }
})


export {
    getAllJobs,
    postJob,
    getMyJob
}