import mongoose from 'mongoose';

const { Schema } = mongoose;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        enum: ['central', 'state', 'local'],
        required: true
    },
    state: {
        type: String,
        required() {
            return this.scope === 'state';
        }
    },
    isRural: {
        type: Boolean,
        required() {
            return this.scope === 'local';
        }
    },
    place: {
        city: {
            type: String,
            required() {
                return this.scope === 'local' && !this.isRural;
            }
        },
        district: {
            type: String,
            required() {
                return this.scope === 'local';
            }
        },
        taluka: {
            type: String,
            required() {
                return this.scope === 'local' && this.isRural;
            }
        },
        village: {
            type: String,
            required() {
                return this.scope === 'local' && this.isRural;
            }
        }
    }
});

export default mongoose.model('Organization', organizationSchema);