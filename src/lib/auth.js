import * as jose from 'jose';
import jwt from 'jsonwebtoken'; // Keep for non-edge contexts

// For Edge Runtime (middleware)
export const verifyAadharToken = (token) => {
    if (!token) return null;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload)
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
export const verifyAuthToken = async (token) => {
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        return payload.userId;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

// For API Routes (non-edge context)
export const verifyToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

// For generating tokens (non-edge context)
export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const generateTempToken = (userId, step) => {
    return jwt.sign(
        { userId, step },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};
