import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/services';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { code } = params;

        // Find the service that provides this document
        const service = await Service.findOne({
            documentCode: code
        }).select('_id');

        if (!service) {
            return NextResponse.json(
                { error: 'No service found for this document' },
                { status: 404 }
            );
        }

        return NextResponse.json({ serviceId: service._id });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
