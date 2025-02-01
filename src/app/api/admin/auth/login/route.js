import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Admin from '@/models/admin';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        await connectDB();

        const admin = await Admin.findOne({ username }).populate('organization');
        
        if (!admin || !await bcrypt.compare(password, admin.password)) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = generateToken({ 
            userId: admin._id,
            role: admin.role,
            org: admin.organization._id 
        });

        const response = NextResponse.json({
            message: 'Login successful',
            admin: {
                username: admin.username,
                email: admin.email,
                role: admin.role,
                organization: admin.organization
            },
            token
        });

        // Set cookie
        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
