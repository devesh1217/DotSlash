import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/services';

export async function GET() {
    try {
        await connectDB();
        const services = await Service.find({}).populate('organization');
        return NextResponse.json({ services }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
