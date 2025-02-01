import jwt from 'jsonwebtoken';

export const verifyAuthToken = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

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
