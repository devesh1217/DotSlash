import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import connectDB from '@/lib/db';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req) {
    try {
        const { name, email, password, mobileNo } = await req.json();
        
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new user
        const user = new User({
            name,
            email,
            mobileNo,
            password: hashedPassword,
            verificationToken
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json(
            { message: 'User created successfully. Please verify your email.' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
