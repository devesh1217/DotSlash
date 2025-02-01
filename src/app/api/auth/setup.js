import connectDB from '@/lib/db';
import Organization from '@/models/organization';

export async function ensureUidaiAuthority() {
    try {
        await connectDB();
        
        // Check if UIDAI already exists
        let uidai = await Organization.findOne({ name: 'Unique Identification Authority of India' });
        
        if (!uidai) {
            // Create UIDAI organization if it doesn't exist
            uidai = await Organization.create({
                name: 'Unique Identification Authority of India',
                scope: 'central',
                _id: process.env.UIDAI_AUTHORITY_ID // Make sure this matches the ID in your .env
            });
        }

        return uidai._id;
    } catch (error) {
        console.error('Failed to ensure UIDAI authority:', error);
        throw error;
    }
}
