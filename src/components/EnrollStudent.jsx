import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, X, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import * as faceapi from 'face-api.js';

const EnrollStudent = ({ onClose }) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        email: ''
    });
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null); // Store stream in state
    const [faceDescriptor, setFaceDescriptor] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureProgress, setCaptureProgress] = useState(0);

    // Load HIGH ACCURACY models
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                console.log('Loading high-accuracy face-api models...');

                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);

                console.log('High-accuracy models loaded successfully');
                setModelsLoaded(true);
            } catch (err) {
                console.error('Failed to load face-api models:', err);
                setStatus({ type: 'error', message: 'Failed to load AI models. Check your internet connection.' });
            }
        };

        loadModels();
    }, []);

    // Attach stream to video element when it becomes available
    useEffect(() => {
        if (cameraActive && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            console.log('Stream attached to video element');
        }
    }, [cameraActive, stream]);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        if (!modelsLoaded) {
            setStatus({ type: 'error', message: 'AI models are still loading. Please wait...' });
            return;
        }

        try {
            console.log('Requesting camera access...');
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            setStream(newStream);
            setCameraActive(true); // This triggers re-render, showing the <video> tag
            setStatus({ type: 'success', message: 'Camera active. Please center your face.' });
        } catch (err) {
            console.error('Camera error:', err);
            setStatus({ type: 'error', message: 'Camera access denied. Please allow permissions.' });
        }
    };

    const captureFace = async () => {
        if (!videoRef.current || !modelsLoaded) return;

        const samples = [];
        const REQUIRED_SAMPLES = 3;
        setCaptureProgress(0);
        setStatus({ type: 'info', message: 'Starting high-accuracy capture...' });

        try {
            for (let i = 0; i < REQUIRED_SAMPLES; i++) {
                setStatus({ type: 'info', message: `Capturing angle ${i + 1}/${REQUIRED_SAMPLES}. Hold still...` });

                const detection = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    samples.push(detection.descriptor);
                    setCaptureProgress(((i + 1) / REQUIRED_SAMPLES) * 100);

                    // Draw feedback
                    const canvas = canvasRef.current;
                    if (canvas && videoRef.current) {
                        const displaySize = {
                            width: videoRef.current.videoWidth,
                            height: videoRef.current.videoHeight
                        };
                        faceapi.matchDimensions(canvas, displaySize);
                        const resizedDetection = faceapi.resizeResults(detection, displaySize);
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        faceapi.draw.drawDetections(canvas, resizedDetection);
                    }

                    await new Promise(r => setTimeout(r, 800));
                } else {
                    setStatus({ type: 'error', message: `Face not clear. Please look at the camera.` });
                    setCaptureProgress(0);
                    return;
                }
            }

            // Average descriptors
            const avgDescriptor = new Float32Array(128);
            for (let i = 0; i < 128; i++) {
                let sum = 0;
                for (let j = 0; j < samples.length; j++) {
                    sum += samples[j][i];
                }
                avgDescriptor[i] = sum / samples.length;
            }

            setFaceDescriptor(Array.from(avgDescriptor));
            setStatus({ type: 'success', message: '✅ High-quality face profile created!' });

        } catch (err) {
            console.error('Capture error:', err);
            setStatus({ type: 'error', message: 'Capture failed. Please try again.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Enroll button clicked");

        if (!formData.name.trim() || !formData.usn.trim() || !formData.email.trim()) {
            setStatus({ type: 'error', message: 'Please fill in all fields (Name, USN, Email).' });
            return;
        }

        if (!faceDescriptor) {
            console.error("No face descriptor found");
            setStatus({ type: 'error', message: '⚠️ Face not captured. Please click "Capture Face" and wait for completion.' });
            return;
        }

        console.log("Submitting enrollment data...", {
            name: formData.name,
            usn: formData.usn,
            email: formData.email,
            descriptorLength: faceDescriptor.length,
            descriptorType: Array.isArray(faceDescriptor) ? 'array' : typeof faceDescriptor
        });

        setLoading(true);
        setStatus({ type: 'info', message: 'Saving student profile...' });

        try {
            const descriptorArray = Array.isArray(faceDescriptor) ? faceDescriptor : Array.from(faceDescriptor);

            console.log("Inserting into Supabase with descriptor:", descriptorArray.slice(0, 5), "...");

            const { data, error } = await supabase
                .from('students')
                .insert([{
                    name: formData.name.trim(),
                    usn: formData.usn.trim().toUpperCase(),
                    email: formData.email.trim().toLowerCase(),
                    face_descriptor: descriptorArray
                }])
                .select();

            if (error) {
                console.error("Supabase error details:", {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw error;
            }

            console.log("Enrollment success! Data:", data);
            setStatus({ type: 'success', message: '🎉 Student enrolled successfully!' });

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            console.error('Enrollment error:', err);
            let errorMsg = '';
            if (err.code === '23505') {
                errorMsg = '❌ Student with this USN or Email already exists.';
            } else if (err.code === '42501') {
                errorMsg = '❌ Permission denied. Run fix-rls-policy.sql in Supabase.';
            } else if (err.code === '22P02') {
                errorMsg = '❌ Invalid face data format. Please try capturing again.';
            } else {
                errorMsg = `Error: ${err.message || 'Unknown error'}`;
            }
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel animate-scale" style={{ padding: '2rem', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
            </button>

            <h3 style={{ marginBottom: '1.5rem' }}>Enroll New Student</h3>

            {status.message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                        status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: status.type === 'success' ? 'var(--success)' :
                        status.type === 'error' ? 'var(--danger)' : 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid currentColor'
                }}>
                    {status.type === 'success' ? <CheckCircle size={20} /> :
                        status.type === 'error' ? <AlertCircle size={20} /> : <Loader size={20} className="animate-pulse" />}
                    <span>{status.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>USN</label>
                            <input type="text" value={formData.usn} onChange={e => setFormData({ ...formData, usn: e.target.value })} placeholder="Enter USN" />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>Face Capture</h4>
                        {modelsLoaded ?
                            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● AI Ready</span> :
                            <span style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>● Loading AI...</span>
                        }
                    </div>

                    {!cameraActive ? (
                        <button type="button" className="btn btn-secondary" onClick={startCamera} disabled={!modelsLoaded} style={{ width: '100%' }}>
                            <Camera size={20} /> Start Camera
                        </button>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: '8px' }} />
                            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" className="btn btn-primary" onClick={captureFace} disabled={captureProgress > 0 && captureProgress < 100} style={{ flex: 1 }}>
                                    {captureProgress > 0 && captureProgress < 100 ? `Capturing ${Math.round(captureProgress)}%` : 'Capture Face (3 Samples)'}
                                </button>
                                {faceDescriptor && (
                                    <button type="button" className="btn btn-ghost" onClick={() => { setFaceDescriptor(null); setCaptureProgress(0); }}>
                                        <RefreshCw size={20} /> Retake
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.1rem',
                        opacity: loading ? 0.7 : 1
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Loader size={20} className="animate-pulse" /> Enrolling...
                        </span>
                    ) : (
                        'Enroll Student'
                    )}
                </button>
            </form>
        </div>
    );
};

export default EnrollStudent;
