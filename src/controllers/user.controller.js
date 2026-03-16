import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshTokens = async(user) => {
    try {
        const user = await User.findById(user._id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch(error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Failed to generate authentication tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {

    console.log("req.body:", req.body);   
    console.log("req.files:", req.files); 

    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // Step 1: Validate fields
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 2: Check existing user - ADD await here to ensure it waits for the database response
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "Email or username already exists");
    }

    // Step 3: Get file paths - ADD optional chaining 
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

const loginUser = asyncHandler(async (req, res) => {
    // Implement login logic here
    const { email, username, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, "Email or username are required");
    }   
    const user = await User.findOne({   
        $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");   
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
     
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true, // Set to true in production (HTTPS)
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        success: true,
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken,
        refreshToken
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    // Implement logout logic here
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { new: true });

    const options = {
        httpOnly: true,
        secure: true, // Set to true in production (HTTPS)
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };