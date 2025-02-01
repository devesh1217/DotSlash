'use client';
import { useEffect, useState } from 'react';
import { Card, Descriptions, Button, message, Skeleton, Result, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, SafetyCertificateOutlined, ClockCircleOutlined } from '@ant-design/icons';

export default function DocumentDetail({ params }) {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                    <Card title="Document Hash" className="shadow-md">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <code className="break-all text-sm">{document.docHash}</code>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm">
                            This is a unique identifier for your document stored on the blockchain
                        </p>
                    </Card>

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
                </div>
            )}
        </div>
    );
}
