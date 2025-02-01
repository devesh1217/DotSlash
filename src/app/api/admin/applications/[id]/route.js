import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/application';
import User from '@/models/user';
import { verifyAuthToken, verifyToken } from '@/lib/auth';
import { generateDocumentHash, generateDocumentNumber } from '@/lib/documentHash';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminId = await verifyToken(authHeader.split(' ')[1]);
        if (!adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const application = await Application.findOne({
            applicationNumber: params.id
        })
        .populate('userId', 'name email')
        .populate({
            path: 'serviceId',
            populate: {
                path: 'organization'
            }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json(application);

    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminId = await verifyAuthToken(authHeader.split(' ')[1]);
        if (!adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status, remarks } = await req.json();

        await connectDB();

        const application = await Application.findOne({ applicationNumber: params.id })
            .populate('serviceId')
            .populate('userId');

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // If approving the application, generate the document
        if (status === 'approved') {
            const documentData = {
                applicationId: application._id,
                userId: application.userId._id,
                serviceId: application.serviceId._id,
                formData: application.formData,
                approvedBy: adminId,
                approvedAt: new Date(),
                applicationNumber: application.applicationNumber
            };

            const docHash = generateDocumentHash(documentData);
            const documentNumber = generateDocumentNumber(application.serviceId.documentCode);

            // Add the generated document to user's documents
            await User.findByIdAndUpdate(
                application.userId._id,
                {
                    $push: {
                        documents: {
                            name: application.serviceId.name,
                            authority: application.serviceId.organization,
                            documentNumber: documentNumber,
                            docHash: docHash,
                            documentCode: application.serviceId.documentCode,
                        }
                    }
                }
            );
        }

        // Update application status
        const updatedApplication = await Application.findOneAndUpdate(
            { applicationNumber: params.id },
            {
                status,
                remarks,
                processedBy: new mongoose.Types.ObjectId(adminId),
                processedAt: new Date()
            },
            { new: true }
        )
        .populate('serviceId')
        .populate('userId', 'email name');

        // Here you could add email notification logic
        
        return NextResponse.json(updatedApplication);

    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
