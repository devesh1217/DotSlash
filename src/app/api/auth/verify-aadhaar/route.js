import { NextResponse } from 'next/server';
import { verifyAadharToken } from '@/lib/auth';
import User from '@/models/user';
import connectDB from '@/lib/db';
import axios from 'axios';
import { generateDocumentHash } from '@/lib/documentHash';
import { sendAadhaarVerificationEmail } from '@/lib/mail';

export async function POST(req) {
    try {
        await connectDB();
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

        const decoded = verifyAadharToken(tempToken);
        console.log(decoded.step);
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
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        const docData = {
            userId: user._id,
            name: 'Aadhaar Card',
            documentCode: 'AAD001',
            documentNumber: aadharNo,
            approvedBy: process.env.UIDAI_AUTHORITY_ID, // MongoDB ObjectId of UIDAI from organizations
            approvedAt: new Date(),
        };
        // Add Aadhaar to user's documents
        const aadharDocument = {
            name: 'Aadhaar Card',
            documentCode: 'AAD001',
            documentNumber: aadharNo,
            authority: process.env.UIDAI_AUTHORITY_ID, // MongoDB ObjectId of UIDAI from organizations
            docHash: generateDocumentHash(docData) || 'hash_placeholder',
        };

        // Update user document with Aadhaar details
        await User.findByIdAndUpdate(decoded.userId, {
            $set: {
                aadharNo: aadharNo,
                isAadharVerified: true,
                isFaceVerified: true,
                faceMatchScore: verificationResult.similarity_score,
                registrationStep: 3
            },
            $push: {
                documents: aadharDocument
            }
        });

        // Send verification success email
        await sendAadhaarVerificationEmail(user.email, user.name, aadharNo);

        return NextResponse.json({
            message: 'Verification successful',
            registrationComplete: true,
            documentAdded: aadharDocument
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify: ' + error.message },
            { status: 500 }
        );
    }
}
