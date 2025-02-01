import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { token, password } = await req.json();
        
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        console.log('Found user:', user); // Debug log

        if (!user) {
            console.log('Token validation failed:', { 
                provided_token: token,
                current_time: new Date(),
            });
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
