import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true, 
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: false,
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    password: {     
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type: String,
        default: null
    },
}, { timestamps: true });

userschema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    );
};

userschema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    );
};
 
export const User = mongoose.models.User || mongoose.model('User', userschema);