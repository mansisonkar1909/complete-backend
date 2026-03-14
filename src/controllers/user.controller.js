import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {

    console.log("req.body:", req.body);   
    console.log("req.files:", req.files); 

    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // Step 1: Validate fields
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 2: Check existing user - ADD await here ✅
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "Email or username already exists");
    }

    // Step 3: Get file paths - ADD optional chaining ✅
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    console.log("avatarLocalPath:", avatarLocalPath); 
    console.log("coverImageLocalPath:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Step 4: Upload to Cloudinary
    const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUploadResult) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const coverImageUploadResult = coverImageLocalPath 
        ? await uploadOnCloudinary(coverImageLocalPath) 
        : null;

    // Step 5: Create user
    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatarUploadResult.url,
        coverImage: coverImageUploadResult?.url || "",
    });

    // Step 6: Fetch without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to retrieve created user");
    }

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: createdUser
    });

});

export { registerUser };