import mongoose from 'mongoose';

const { Schema } = mongoose;

const applicationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'approved', 'rejected'],
        default: 'pending'
    },
    formData: {
        type: Map,
        of: String,
        required: true
    },
    documents: [{
        documentCode: {
            type: String,
            required: true
        },
        documentId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    }],
    applicationNumber: {
        type: String,
        unique: true
    },
    remarks: String,
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date
}, {
    timestamps: true
});

// Generate unique application number before saving
applicationSchema.pre('save', async function(next) {
    if (!this.applicationNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.applicationNumber = `APP${year}${month}${randomNum}`;
    }
    next();
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
