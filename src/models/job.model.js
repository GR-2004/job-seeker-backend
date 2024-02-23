import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: [3, "title must contain at least 3 characters!"],
            maxlength: [50, "title cannot exceed 50 characters!"],
        },
        description: {
            type: String,
            required: true,
            minlength: [3, "description must contain at least 3 characters!"],
            maxlength: [100, "description cannot exceed 50 characters!"],
        },
        category: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        requiredExperience: {
            type: String,
            required: true,
        },
        requiredSkills: {
            type: [String],
            required: true,
        },
        employmentType: {
            type: String,
            required: true,
        },
        jobPostedOn: {
            type: Date,
            default: Date.now,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },  
        expired: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    }
);

export const Job = mongoose.model("Job", jobSchema);