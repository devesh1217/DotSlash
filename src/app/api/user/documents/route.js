import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        await connectDB();
        // TODO: Get actual user ID from session
        const token = req.headers.get('Authorization')?.split(' ')[1]; // Temporary for testing
        const userId = jwt.verify(token, process.env.JWT_SECRET)?.userId;
        const user = await User.findById(userId)
            .select('documents')
            .populate('documents.authority');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const documents = user.documents.map(doc => ({
            documentCode: doc.documentCode,
            name: doc.name,
            documentNumber: doc.documentNumber,
            authority: doc.authority.name
        }));

        return NextResponse.json({ documents });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
