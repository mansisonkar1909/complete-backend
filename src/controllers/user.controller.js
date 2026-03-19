import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse} from '../utils/ApiResponse.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);

        console.log("user found:", user);  // ← ADD
        console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); 

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

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;   
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullname, email} = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

        return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
    })
    
    const getUserChannelProfile = asyncHandler(async(req, res) => {
        const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateAvatar, updateCoverImage, getCurrentUser, getUserChannelProfile, getWatchHistory,} ;