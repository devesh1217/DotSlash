import { QRCodeSVG } from 'qrcode.react';

export default function DocumentPDF({ document }) {
    if (!document) return null;

    const {
        name = '',
        documentNumber = '',
        documentCode = '',
        authority = '',
        docHash = '',
        createdAt = new Date(),
        updatedAt = new Date()
    } = document;

    return (
        <div className="p-8 bg-white text-gov-text" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4">
                <h1 className="text-2xl font-bold mb-2">Government of India</h1>
                <h2 className="text-xl">{authority}</h2>
            </div>

            {/* Document Details */}
            <div className="my-8">
                <h3 className="text-xl font-bold text-center mb-6">{name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border p-4">
                        <p className="font-bold">Document Number</p>
                        <p>{documentNumber}</p>
                    </div>
                    <div className="border p-4">
                        <p className="font-bold">Document Code</p>
                        <p>{documentCode}</p>
                    </div>
                    <div className="border p-4">
                        <p className="font-bold">Issue Date</p>
                        <p>{new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="border p-4">
                        <p className="font-bold">Last Updated</p>
                        <p>{new Date(updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* QR Code and Hash */}
                <div className="flex justify-between items-start mt-8">
                    <div className="w-1/2">
                        <p className="font-bold mb-2">Verification QR Code</p>
                        <QRCodeSVG 
                            value={JSON.stringify({
                                documentCode,
                                documentNumber,
                                docHash,
                                verificationUrl: `${window.location.origin}/verify/${documentCode}`
                            })}
                            size={150}
                            level="H"
                        />
                    </div>
                    <div className="w-1/2">
                        <p className="font-bold mb-2">Document Hash</p>
                        <p className="text-sm break-all font-mono bg-gray-100 p-2">
                            {docHash}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-800 mt-8 pt-4">
                <p className="text-sm text-center text-gray-800">
                    This is an officially issued document. Verify authenticity by scanning the QR code or visiting:
                </p>
                <p className="text-sm text-center font-bold">
                    {window.location.origin}/verify/{documentCode}
                </p>
            </div>
        </div>
    );
}
