import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/application';
import Service from '@/models/services';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectDB();
        
        const data = await req.json();
        const { serviceId, formData } = data;
        
        // Get user from token
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Validate service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        // Get user's documents
        const user = await User.findById(userId).select('documents');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Map required documents to user's documents
        const documents = service.requiredDocuments.map(reqDoc => {
            const userDoc = user.documents.find(d => d.documentCode === reqDoc.documentCode);
            if (!userDoc) {
                throw new Error(`Missing required document: ${reqDoc.name}`);
            }
            return {
                documentCode: reqDoc.documentCode,
                documentId: userDoc._id
            };
        });

        // Create application
        const application = await Application.create({
            userId,
            serviceId,
            formData,
            documents
        });

        return NextResponse.json({
            message: 'Application submitted successfully',
            applicationNumber: application.applicationNumber
        });

    } catch (error) {
        console.error('Application submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to submit application' },
            { status: 500 }
        );
    }
}
