import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    // Step 1: Get user details from request body
    const { fullName, email, username, password } = req.body;
    console.log("email:", email);

    // Step 2: Validate fields
    if ([fullName, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 3: Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "Email or username already exists");
    }

    // Step 4: Get file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Step 5: Upload to Cloudinary
    const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUploadResult) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const coverImageUploadResult = await uploadOnCloudinary(coverImageLocalPath);

    // Step 6: Create user in DB
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatarUploadResult.url,
        coverImage: coverImageUploadResult?.url || "",
    });

    // Step 7: Fetch created user without password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to retrieve created user");
    }

    // Step 8: Send response
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );

}); 

export { registerUser };