import { NextResponse } from 'next/server';
const { verifyAuthToken } = require('@/lib/auth');
import User from '@/models/user';
import connectDB from '@/lib/db';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const tempToken = formData.get('tempToken');
        const aadharNo = formData.get('aadharNo');
        const aadharCardFile = formData.get('aadharCardFile');

        // Remove debug log
        const decoded = verifyAuthToken(tempToken); // Changed to sync call
        
        if (!decoded || decoded.step !== 1) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401 }
            );
        }

        await connectDB();

        // Check if Aadhaar is already registered
        const existingAadhaar = await User.findOne({ aadharNo });
        if (existingAadhaar) {
            return NextResponse.json(
                { error: 'Aadhaar number already registered' },
                { status: 400 }
            );
        }

        // Find user from temp token
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // TODO: Implement actual Aadhaar verification logic here
        // This is a placeholder for the actual verification process
        const isAadhaarValid = await verifyAadhaarWithGovAPI(aadharNo, aadharCardFile);
        
        if (!isAadhaarValid) {
            return NextResponse.json(
                { error: 'Aadhaar verification failed' },
                { status: 400 }
            );
        }

        // Handle file upload
        let aadharCardUrl = null;
        if (aadharCardFile) {
            // TODO: Implement file upload to your storage service
            // This is a placeholder
            aadharCardUrl = await uploadFile(aadharCardFile);
        }

        // Update user with Aadhaar information
        user.aadharNo = aadharNo;
        user.aadharCard = aadharCardUrl;
        user.isAadharVerified = true;
        user.registrationStep = 3; // Mark registration as complete
        await user.save();

        return NextResponse.json({
            message: 'Aadhaar verification successful',
            registrationComplete: true
        });
    } catch (error) {
        console.error('Aadhaar verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify Aadhaar' },
            { status: 500 }
        );
    }
}

// Placeholder function for actual Aadhaar verification
async function verifyAadhaarWithGovAPI(aadharNo, aadharCardFile) {
    // TODO: Implement actual verification logic
    // This is just a placeholder
    return true;
}

// Placeholder function for file upload
async function uploadFile(file) {
    // TODO: Implement actual file upload logic
    return 'placeholder-url';
}
