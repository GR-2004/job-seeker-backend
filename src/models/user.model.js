import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Please enter your Name!"],
            minLength: [3, "Name must contain at least 3 Characters!"],
            maxLength: [30, "Name cannot exceed 30 Characters!"],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            require: [true, "Please provide your email"],
            validate: [validator.isEmail, "please provide a valid email"]
        },
        phone: {
            type: String,
            unique: true,
            required: [true, "please provide your phone number..."],
            validate: [validator.isMobilePhone, "please provide a valid mobile number"]
        },
        password: {
            type: String,
            minlength: [8, "name must contain at least 8 characters!"],
            maxlength: [32, "name cannot exceed 32 characters!"],
        },
        role: {
            type: String,
            required: [true, "please provide your role"],
            enum: ['Job Seeker', "Recruiter"],
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps:true
    }
);

//hashing the password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//comparing the password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

//generating access token
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generating refresh token
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);