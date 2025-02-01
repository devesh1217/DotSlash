'use client';
import { useEffect, useState, useRef } from 'react';
import { Card, Descriptions, Button, message, Skeleton, Result, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, SafetyCertificateOutlined, ClockCircleOutlined, DownloadOutlined, QrcodeOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import DocumentPDF from '@/components/DocumentPDF';

export default function DocumentDetail({ params }) {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const documentRef = useRef(null);

    useEffect(() => {
        fetchDocument();
    }, []);

    const fetchDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/documents/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch document');
            
            const data = await response.json();
            setDocument(data.document);
        } catch (error) {
            setError(error.message);
            message.error('Failed to load document details');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const element = documentRef.current;
        const opt = {
            margin: 0.5,
            filename: `document-${document.documentCode}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => window.location.href = '/documents'}
                    className="mr-4"
                >
                    Back
                </Button>
                <h1 className="text-2xl font-bold m-0 flex-grow text-gov-text">Document Details</h1>
            </div>

            {loading ? (
                <Skeleton active />
            ) : error || !document ? (
                <Result
                    status="error"
                    title="Failed to load document"
                    subTitle="Please try again later"
                    extra={[
                        <Button 
                            key="back"
                            onClick={() => window.location.href = '/documents'}
                        >
                            Back to Documents
                        </Button>
                    ]}
                />
            ) : (
                <div className="space-y-6">
                    <Card className="shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">{document.name}</h2>
                                <p className="text-gray-500">Document Code: {document.documentCode}</p>
                            </div>
                            <Tag color="green" icon={<SafetyCertificateOutlined />}>
                                Verified Document
                            </Tag>
                        </div>
                        <Divider />
                        <Descriptions column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Document Number" className="font-medium">
                                {document.documentNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Issuing Authority" className="font-medium">
                                {document.authority}
                            </Descriptions.Item>
                            <Descriptions.Item label="Issue Date" className="font-medium">
                                <ClockCircleOutlined className="mr-2" />
                                {new Date(document.createdAt).toLocaleDateString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Updated" className="font-medium">
                                <ClockCircleOutlined className="mr-2" />
                                {new Date(document.updatedAt).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="QR Code" className="shadow-md">
                            <div className="flex flex-col items-center">
                                <QRCodeSVG 
                                    value={JSON.stringify({
                                        documentCode: document.documentCode,
                                        documentNumber: document.documentNumber,
                                        docHash: document.docHash,
                                        verificationUrl: `${window.location.origin}/verify/${document.documentCode}`
                                    })}
                                    size={200}
                                    level="H"
                                />
                                <p className="text-gray-500 mt-4 text-sm text-center">
                                    Scan to verify document authenticity
                                </p>
                            </div>
                        </Card>

                        <Card title="Document Hash" className="shadow-md">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <code className="break-all text-sm">{document.docHash}</code>
                            </div>
                            <p className="text-gray-500 mt-2 text-sm">
                                This is a unique identifier for your document stored on the blockchain
                            </p>
                        </Card>
                    </div>

                    <Card title="Document Timeline" className="shadow-md">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-full mr-4">
                                    <SafetyCertificateOutlined className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Document Issued</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(document.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-center mt-6">
                        <Button 
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={generatePDF}
                            size="large"
                        >
                            Download PDF
                        </Button>
                    </div>
                </div>
            )}

            {/* Hidden PDF template - Only render when document is available */}
            {document && !loading && !error && (
                <div className="hidden">
                    <div ref={documentRef}>
                        <DocumentPDF document={document} />
                    </div>
                </div>
            )}
        </div>
    );
}
