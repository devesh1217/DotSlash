import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import User from '@/models/user';
import dbConnect from '@/lib/db';

export async function GET(request) {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(decoded)
            .populate('documents.authority')
            .select('documents');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user.documents);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
