import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const CameraFeed = ({ onFacesDetected }) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [videoInitialized, setVideoInitialized] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                // Using a CDN that hosts the models
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

                console.log("Loading models from", MODEL_URL);
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                console.log("Models loaded successfully");
                setModelsLoaded(true);
            } catch (err) {
                console.error("Failed to load models", err);
                setError("Failed to load AI models. Check console for details.");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Error accessing camera:", err);
                setError("Camera access denied or not available.");
            });
    };

    useEffect(() => {
        if (modelsLoaded) {
            startVideo();
        }
    }, [modelsLoaded]);

    const handleVideoPlay = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        // Wait for video to have dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            setTimeout(handleVideoPlay, 100);
            return;
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        setVideoInitialized(true);

        const intervalId = setInterval(async () => {
            if (!video || video.paused || video.ended) return;

            try {
                // Add descriptors for recognition
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                // Clear canvas
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw detections
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                }

                // Pass data to parent
                if (onFacesDetected) {
                    onFacesDetected(detections);
                }
            } catch (e) {
                console.error("Detection error:", e);
            }
        }, 200); // 5 FPS - Optimized for performance

        return () => clearInterval(intervalId);
    };

    return (
        <div className="glass-panel" style={{ position: 'relative', width: '100%', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}>
            {!modelsLoaded && !error && (
                <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                    <h3>Loading AI Models...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Please wait while we fetch the neural networks.</p>
                </div>
            )}

            {error && (
                <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {modelsLoaded && (
                <div style={{ position: 'relative' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline // Critical for Safari
                        onPlay={handleVideoPlay}
                        style={{ borderRadius: '12px', maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
