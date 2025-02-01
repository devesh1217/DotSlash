import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import User from '@/models/user';
import connectDB from '@/lib/db';
import axios from 'axios';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const tempToken = formData.get('tempToken');
        const aadharNo = formData.get('aadharNo');
        const aadharCardFile = formData.get('aadharCardFile');
        const selfieImage = formData.get('selfieImage');

        if (!aadharCardFile || !selfieImage) {
            return NextResponse.json(
                { error: 'Both Aadhaar card and selfie are required' },
                { status: 400 }
            );
        }

        const decoded = verifyAuthToken(tempToken);
        if (!decoded || decoded.step !== 1) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401 }
            );
        }

        // Call government API for verification
        const govApiFormData = new FormData();
        govApiFormData.append('selfie', selfieImage);
        govApiFormData.append('document', aadharCardFile);

        const verificationResponse = await axios.post(process.env.GOV_FACE_VERIFY_API, govApiFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(verificationResponse)
        if (!verificationResponse.data.match) {
            throw new Error(verificationResponse.data.detail || 'Verification failed');
        }

        const verificationResult = verificationResponse.data;

        // Verify the response
        if (!verificationResult.match || verificationResult.similarity_score < 0.65) {
            return NextResponse.json(
                { error: 'Face verification failed - No match found' },
                { status: 400 }
            );
        }

        // Verify Aadhaar number matches
        // if (verificationResult.aadhaar_number !== aadharNo) {
        //     return NextResponse.json(
        //         { error: 'Aadhaar number mismatch' },
        //         { status: 400 }
        //     );
        // }

        // Update user record
        await connectDB();
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        user.aadharNo = aadharNo;
        user.isAadharVerified = true;
        user.isFaceVerified = true;
        user.faceMatchScore = verificationResult.similarity_score;
        user.registrationStep = 3;
        await user.save();

        return NextResponse.json({
            message: 'Verification successful',
            registrationComplete: true
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify: ' + error.message },
            { status: 500 }
        );
    }
}
