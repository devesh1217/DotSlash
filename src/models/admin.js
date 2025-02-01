import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'adminUser'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
},{
    timestamps: true
});

export default mongoose.model('Admin', AdminSchema);