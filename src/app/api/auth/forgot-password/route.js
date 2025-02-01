import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectDB from '@/lib/db';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/mail';

export async function POST(req) {
    try {
        const { email } = await req.json();
        
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found with this email' },
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        console.log('Reset token created:', { 
            token: resetToken,
            expires: user.resetPasswordExpires 
        });

        await sendResetEmail(email, resetToken);

        return NextResponse.json({
            message: 'Password reset link has been sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to send reset link' },
            { status: 500 }
        );
    }
}
