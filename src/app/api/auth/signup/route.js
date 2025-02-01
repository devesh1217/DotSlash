import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import connectDB from '@/lib/db';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/mail';
import {generateTempToken} from '@/lib/auth';

export async function POST(req) {
    try {
        const { 
            firstName, 
            middleName, 
            lastName, 
            email, 
            password, 
            mobileNo,
            dob,
            gender,
        } = await req.json();
        
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

        // Create new user with initial registration step
        const user = new User({
            name: {
                first: firstName,
                middle: middleName,
                last: lastName
            },
            email,
            mobileNo,
            password: hashedPassword,
            verificationToken,
            dob: new Date(dob),
            gender,
            registrationStep: 1
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        // Generate temp token for face verification (first step)
        const tempToken = generateTempToken(user._id, 1);

        return NextResponse.json({
            message: 'User created successfully',
            tempToken,
            nextStep: 'face-verification'
        }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
