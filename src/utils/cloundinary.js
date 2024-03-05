import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            secure: true 
        })
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temproary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = (publicId) => {
    if (!publicId) return Promise.reject("Public ID not found");

    // Determine the resource type based on the file extension
    const extension = publicId.split('.').pop().toLowerCase();
    let resourceType;

    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        resourceType = 'image';
    } else if (extension === 'pdf') {
        resourceType = 'raw';
    } else {
        return Promise.reject("Unsupported file type");
    }

    // Extract the image name from the public ID
    const imageName = publicId.split('/').pop().split('.')[0];

    // Construct the options object for the destroy method
    const options = {
        resource_type: resourceType
    };

    // Return a promise that resolves or rejects based on the Cloudinary delete operation
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(imageName, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};



export {uploadOnCloudinary, deleteFromCloudinary}