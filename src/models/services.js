import mongoose from 'mongoose';

const { Schema } = mongoose;

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    requiredDocuments: [{
        name: {
            type: String,
            required: true
        },
        documentCode: {
            type: String,
            required: true
        },
    }],
    formFields: [{
        name: { type: String, required: true },
        label: { type: String, required: true },
        type: {
            type: String,
            enum: ['text', 'number', 'email', 'date', 'select', 'file', 'checkbox'],
            required: true
        },
        required: { type: Boolean, default: false },
        options: [String],
        validations: {
            minLength: Number,
            maxLength: Number,
            pattern: String,
            min: Number,
            max: Number
        }
    }],
    documentCode: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

// Export both schema and model
export { serviceSchema };
export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
