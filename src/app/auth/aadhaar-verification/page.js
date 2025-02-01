'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Webcam from 'react-webcam';

export default function AadhaarVerification() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        aadharNo: '',
        aadharCardFile: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filePreview, setFilePreview] = useState('');
    const webcamRef = useRef(null);
    const [selfieImage, setSelfieImage] = useState(null);
    const [webcamError, setWebcamError] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(false);

    const token = searchParams.get('token');
    const prefilledAadhaar = searchParams.get('aadhaar');

    const videoConstraints = {
        width: 720,
        height: 480,
        facingMode: "user"
    };

    useEffect(() => {
        if (!token) {
            router.push('/auth/signup');
        }
        if (prefilledAadhaar) {
            setFormData(prev => ({ ...prev, aadharNo: prefilledAadhaar }));
        }
    }, [token, prefilledAadhaar, router]);

    useEffect(() => {
        // Request camera permission on component mount
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                setCameraPermission(true);
                setWebcamError(false);
            })
            .catch((err) => {
                console.error("Camera error:", err);
                setWebcamError(true);
                setError('Camera access denied. Please enable camera permissions.');
            });

        return () => {
            // Cleanup webcam on unmount
            if (webcamRef.current && webcamRef.current.stream) {
                const tracks = webcamRef.current.stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, aadharCardFile: file }));
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const capturePhoto = useCallback(() => {
        if (!webcamRef.current || !webcamRef.current.getScreenshot) {
            setError('Camera not initialized or unavailable.');
            return;
        }
    
        setTimeout(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setSelfieImage(imageSrc);
            } else {
                setError('Failed to capture photo. Please try again.');
            }
        }, 500); // Short delay
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selfieImage || !formData.aadharCardFile) {
            setError('Both selfie and Aadhaar card are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Convert base64 selfie to file
            const selfieBlob = await fetch(selfieImage).then(r => r.blob());
            const selfieFile = new File([selfieBlob], 'selfie.jpg', { type: 'image/jpeg' });

            const submitFormData = new FormData();
            submitFormData.append('tempToken', token);
            submitFormData.append('aadharNo', formData.aadharNo);
            submitFormData.append('aadharCardFile', formData.aadharCardFile);
            submitFormData.append('selfieImage', selfieFile);

            const res = await fetch('/api/auth/verify-aadhaar', {
                method: 'POST',
                body: submitFormData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push('/auth/login?message=Registration completed successfully. Please login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="space-y-4">
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Aadhaar Verification
                    </h2>
                    <p className="text-center text-gray-600">
                        Please provide your Aadhaar details to complete registration
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-center items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">✓</div>
                            <span className="ml-2 text-sm">Basic Info</span>
                        </div>
                        <div className="w-16 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gov-primary text-white rounded-full flex items-center justify-center">2</div>
                            <span className="ml-2 text-sm">Verification</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                        {/* Webcam/Selfie Section */}
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-4">Take Selfie</h3>
                            {webcamError ? (
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-600">Camera access denied or not available.</p>
                                    <p className="text-sm text-red-500 mt-2">
                                        Please enable camera access in your browser settings and refresh the page.
                                    </p>
                                </div>
                            ) : !selfieImage ? (
                                <div className="relative">
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                        className="w-full rounded-lg"
                                    />

                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="mt-4 w-full bg-gov-primary text-white px-4 py-2 rounded-lg hover:bg-gov-primary/90 transition-colors"
                                    >
                                        Capture Photo
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img src={selfieImage} alt="Selfie" className="w-full rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setSelfieImage(null)}
                                        className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Retake Photo
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="aadharNo" className="block text-sm font-medium text-gray-700">
                                Aadhaar Number *
                            </label>
                            <input
                                id="aadharNo"
                                type="text"
                                required
                                pattern="\d{12}"
                                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:ring-gov-primary focus:border-gov-primary"
                                placeholder="Enter 12-digit Aadhaar number"
                                value={formData.aadharNo}
                                onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Aadhaar Card *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-2 text-center">
                                    {filePreview ? (
                                        <div className="mb-4">
                                            <img src={filePreview} alt="Aadhaar preview" className="max-h-32 mx-auto" />
                                        </div>
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gov-primary hover:text-gov-primary/80">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, PDF up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selfieImage || !formData.aadharCardFile}
                        className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gov-primary hover:bg-gov-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-semibold"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : 'Complete Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
}
