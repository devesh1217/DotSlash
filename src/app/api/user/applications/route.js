import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/application';
import { verifyAuthToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req) {
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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        await connectDB();

        let query = { userId: new mongoose.Types.ObjectId(userId) };
        
        // Add status filter if provided
        if (status && ['pending', 'processing', 'approved', 'rejected'].includes(status)) {
            query.status = status;
        }

        // Add search filter if provided
        if (search) {
            query['$or'] = [
                { applicationNumber: { $regex: search, $options: 'i' } },
                { 'serviceId.name': { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Application.countDocuments(query);
        const applications = await Application.find(query)
            .populate('serviceId')
            .populate({
                path: 'serviceId',
                populate: {
                    path: 'organization'
                }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            applications,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
