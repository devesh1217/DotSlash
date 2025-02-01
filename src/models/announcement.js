import mongoose from 'mongoose';

const { Schema } = mongoose;

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Sets the default timestamp to the current date and time
    },
    expiry: {
        type: Date,
        required: true, // Expiry date should be provided
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
