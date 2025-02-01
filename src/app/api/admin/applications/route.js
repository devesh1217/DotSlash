import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/application';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminId = await verifyToken(authHeader.split(' ')[1]);
        if (!adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const organization = searchParams.get('organization');
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');

        await connectDB();

        let query = {};

        // Add filters if provided
        if (status) query.status = status;
        if (organization) query['serviceId.organization'] = new mongoose.Types.ObjectId(organization);
        if (fromDate && toDate) {
            query.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        if (search) {
            query.$or = [
                { applicationNumber: { $regex: search, $options: 'i' } },
                { 'serviceId.name': { $regex: search, $options: 'i' } }
            ];
        }

        const [total, applications] = await Promise.all([
            Application.countDocuments(query),
            Application.find(query)
                .populate('userId', 'name email')
                .populate({
                    path: 'serviceId',
                    populate: {
                        path: 'organization'
                    }
                })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

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
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
