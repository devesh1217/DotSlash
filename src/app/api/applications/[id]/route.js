import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/application';
import { verifyAuthToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const userId = await verifyAuthToken(token);
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const application = await Application.findOne({
            applicationNumber: params.id,
            userId: new mongoose.Types.ObjectId(userId)
        })
        .populate('serviceId')
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
