import mongoose from 'mongoose';

const { Schema } = mongoose;

const announcementSchema = new Schema({
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

export default Announcement;
