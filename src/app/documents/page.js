'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Alert, message, Tooltip, Space, Skeleton, Tag, Card } from 'antd';
import { QuestionCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingHash, setVerifyingHash] = useState(null);
    const [messageInfo, setMessageInfo] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/documents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.log(error)
            // message.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const verifyDocument = async (docHash) => {
        setVerifyingHash(docHash);
        setMessageInfo(null); // Clear previous message
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/documents/verify/${docHash}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Verification failed');
            const result = await response.json();
            if (result.verified) {
                setMessageInfo({
                    type: 'success',
                    message: 'Document verified successfully!',
                });
            } else {
                setMessageInfo({
                    type: 'warning',
                    message: 'Document verification failed. The document may have been tampered with.',
                });
            }
        } catch (error) {
            setMessageInfo({
                type: 'error',
                message: 'Failed to verify document. Please try again later.',
            });
        } finally {
            setVerifyingHash(null);
        }
    };

    const columns = [
        {
            title: 'Document Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <span className="font-medium">{text}</span>
            ),
        },
        {
            title: 'Document Number',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
        },
        {
            title: 'Issuing Authority',
            dataIndex: ['authority', 'name'],
            key: 'authority',
            render: (text) => (
                <Tag color="blue">{text}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary"
                        loading={verifyingHash === record.docHash}
                        onClick={() => verifyDocument(record.docHash)}
                        icon={<SafetyCertificateOutlined />}
                    >
                        Verify
                    </Button>
                    <Button 
                        onClick={() => window.location.href = `/documents/${record.documentCode}`}
                        type="default"
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
                    <p className="text-gray-500">Manage and verify your digital documents</p>
                </div>
                <Space>
                    <Tooltip title="Documents are verified using blockchain technology">
                        <QuestionCircleOutlined className="text-gray-500" />
                    </Tooltip>
                </Space>
            </div>
            
            {messageInfo && (
                <Alert
                    message={messageInfo.message}
                    type={messageInfo.type}
                    showIcon
                    className="mb-4"
                    closable
                    onClose={() => setMessageInfo(null)}
                />
            )}
            
            <Card className="shadow-md">
                {loading ? (
                    <Skeleton active />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={documents}
                        rowKey="docHash"
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </Card>
        </div>
    );
}
