import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Announcement from '@/models/announcement';

export async function GET() {
    try {
        await connectDB();
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        return NextResponse.json({ announcements }, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const { message } = await request.json();
        const newAnnouncement = new Announcement({ message });
        await newAnnouncement.save();
        return NextResponse.json({ announcement: newAnnouncement }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { id } = await request.json();
        await Announcement.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Announcement deleted' }, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
