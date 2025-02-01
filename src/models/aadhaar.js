import mongoose from 'mongoose';

const { Schema } = mongoose;

const AadhaarSchema = new Schema({
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 12,
        maxlength: 12
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    biometric: {
        fingerprints: {
            type: [Buffer],
            required: true
        },
        irisScan: {
            type: Buffer,
            required: true
        },
        faceScan: {
            type: Buffer,
            required: true
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('Aadhaar', AadhaarSchema);