import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const token = req.headers.get('Authorization')?.split(' ')[1];
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

        const document = user.documents.find(doc => doc.documentCode === id);

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            document: {
                name: document.name,
                documentNumber: document.documentNumber,
                documentCode: document.documentCode,
                authority: document.authority.name,
                docHash: document.docHash,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
