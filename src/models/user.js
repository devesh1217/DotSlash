import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const userSchema = new Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        first: {
            type: String,
            required: true,
            trim: true
        },
        middle: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            required: true,
            trim: true
        }
    },
    dob: {
        type: Date,
        required: true
    },
    guardianLink: {
        type: String,
        ref: 'User'
    },
    blockchainIdHash: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    aadharNo: {
        type: String,
        sparse: true, // Allows null but ensures uniqueness when present
        trim: true
    },
    aadharCard: {
        type: String, // URL or path to stored document
        default: null
    },
    isAadharVerified: {
        type: Boolean,
        default: false
    },
    registrationStep: {
        type: Number,
        default: 1, // 1: Basic Info, 2: Aadhaar Verification, 3: Completed
        enum: [1, 2, 3]
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        authority: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
        },
        documentNumber: {
            type: String,
            required: true
        },
        docHash: {
            type: String,
            required: true
        },
        documentCode: {
            type: String,
            required: true
        },
    }],
}, {
    timestamps: true
});

// Check if the model exists before compiling it
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;