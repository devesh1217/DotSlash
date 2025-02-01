import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/services';

export async function GET(request, context) {
    try {
        await connectDB();
        const id = context.params.id;
        
        const service = await Service.findById(id).populate('organization');
        
        if (!service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
