import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendVerificationEmail = async (email, token) => {
    try {
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}">${'Verification Link'}</a>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendResetEmail = async (email, token) => {
    try {
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `
                <h1>Password Reset Request</h1>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Failed to send reset email');
    }
};

export const sendApplicationStatusEmail = async (userEmail, userName, applicationNumber, status, remarks) => {
    try {
        const statusMessages = {
            approved: 'has been approved',
            rejected: 'has been rejected',
            processing: 'is now being processed'
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Application Status Update - ${applicationNumber}`,
            html: `
                <h1>Application Status Update</h1>
                <p>Dear ${userName},</p>
                <p>Your application (${applicationNumber}) ${statusMessages[status] || 'has been updated'}.</p>
                ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
                <p>You can check your application status by logging into your account.</p>
                <p>If you have any questions, please contact our support team.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending application status email:', error);
        throw new Error('Failed to send application status email');
    }
};

export const sendAadhaarVerificationEmail = async (email, userName, aadharNo) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Aadhaar Verification Successful',
            html: `
                <h1>Aadhaar Verification Complete</h1>
                <p>Dear ${userName},</p>
                <p>Your Aadhaar verification has been completed successfully.</p>
                <p>Verified Aadhaar Number: XXXX-XXXX-${aadharNo.slice(-4)}</p>
                <p>You can now proceed with using our services that require Aadhaar verification.</p>
                <p>If you didn't request this verification, please contact our support team immediately.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending Aadhaar verification email:', error);
        throw new Error('Failed to send Aadhaar verification email');
    }
};
