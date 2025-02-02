import crypto from 'crypto';

export const generateDocumentHash = (documentData) => {
    console.log(documentData, JSON.stringify(documentData))
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(documentData));
    return hash.digest('hex');
};

export const generateDocumentNumber = (prefix) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${month}${random}`;
};
