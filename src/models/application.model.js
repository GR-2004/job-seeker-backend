import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            requried: [true, "Please provide your name"],
            minlength: [3, "name must contains at least 3 characters"],
            maxlength: [30, "name cannot exceed 30 characters"],
        },
        email: {
            type: String,
            requried: [true, "Please provide your email"],
            validator: [validator.isEmail, "please provide a valid email"]
        },
        coverLetter: {
            type: String,
            requried: [true, "Please provide your coverLetter"]
        },
        phone: {
            type: Number,
            requried: [true, "Please provide your phone number"],
            validator: [validator.isMobilePhone, "please provide a valid phone number"]
        },
        address: {
            type: String,
            requried: [true, "Please provide your address"]
        },
        resume: {
            type: String,
            requried: [true, "Please provide your resume"]
        },
        jobSeekerID: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ['Job Seeker'],
                required: true
            }
        },
        recruiterID: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ['Recruiter'],
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);


export const Application = mongoose.model("Application", applicationSchema)