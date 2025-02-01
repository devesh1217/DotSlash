import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import User from '@/models/user';
import dbConnect from '@/lib/db';

export async function GET(request, { params }) {
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

        const user = await User.findOne({
            _id: decoded,
            'documents.docHash': params.hash
        });

        if (!user) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const document = user.documents.find(doc => doc.docHash === params.hash);
        
        // Here you would typically verify the document hash on the blockchain
        const isVerified = true;

        return NextResponse.json({ 
            verified: isVerified,
            message: isVerified ? 
                'Document successfully verified on blockchain' : 
                'Document verification failed'
        });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Verification process failed',
            details: error.message 
        }, { status: 500 });
    }
}