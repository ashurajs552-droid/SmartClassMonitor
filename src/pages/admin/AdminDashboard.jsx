import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Play, Square, UserPlus, Moon, Sun, Users, Activity, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import CameraFeed from '../../components/CameraFeed';
import Dashboard from '../../components/Dashboard';
import EnrollStudent from '../../components/EnrollStudent';
import * as faceapi from 'face-api.js';

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [showEnroll, setShowEnroll] = useState(false);
    const [detections, setDetections] = useState([]);
    const [sessionData, setSessionData] = useState([]);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [attendanceState, setAttendanceState] = useState({}); // { usn: { status, lastSeen, name } }
    const [faceMatcher, setFaceMatcher] = useState(null);

    const detectionsRef = useRef([]);
    const sessionDataRef = useRef([]);
    const intervalRef = useRef(null);
    const attendanceIntervalRef = useRef(null);

    // Fetch enrolled students and initialize FaceMatcher
    useEffect(() => {
        fetchEnrolledStudents();
    }, []);

    const fetchEnrolledStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*');

            if (error) throw error;
            setEnrolledStudents(data || []);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    // Initialize FaceMatcher whenever enrolledStudents changes
    useEffect(() => {
        if (enrolledStudents.length > 0) {
            const labeledDescriptors = enrolledStudents
                .filter(s => s.face_descriptor && s.face_descriptor.length > 0)
                .map(s => new faceapi.LabeledFaceDescriptors(
                    s.usn,
                    [new Float32Array(s.face_descriptor)]
                ));

            if (labeledDescriptors.length > 0) {
                setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
                console.log('FaceMatcher updated with', labeledDescriptors.length, 'students');
            }
        }
    }, [enrolledStudents]);

    useEffect(() => {
        detectionsRef.current = detections;
    }, [detections]);

    useEffect(() => {
        sessionDataRef.current = sessionData;
    }, [sessionData]);

    // Attendance Logic Loop (runs frequently)
    useEffect(() => {
        if (!isMonitoring || !faceMatcher) return;

        const checkAttendance = () => {
            const currentDetections = detectionsRef.current;
            const now = Date.now();
            const newAttendanceState = { ...attendanceState };
            let stateChanged = false;

            // 1. Process detections -> Mark Present
            currentDetections.forEach(detection => {
                const match = faceMatcher.findBestMatch(detection.descriptor);
                if (match.label !== 'unknown') {
                    const usn = match.label;
                    const student = enrolledStudents.find(s => s.usn === usn);

                    if (student) {
                        if (!newAttendanceState[usn] || newAttendanceState[usn].status !== 'Present') {
                            // Mark as present
                            newAttendanceState[usn] = {
                                status: 'Present',
                                lastSeen: now,
                                name: student.name,
                                usn: student.usn,
                                firstSeen: newAttendanceState[usn]?.firstSeen || now
                            };
                            stateChanged = true;

                            // Log attendance to DB (optional, maybe throttle this)
                            // logAttendanceToDB(student.id, 'Present');
                        } else {
                            // Just update last seen
                            newAttendanceState[usn].lastSeen = now;
                        }
                    }
                }
            });

            // 2. Check for "Left Session" (timeout)
            Object.keys(newAttendanceState).forEach(usn => {
                const record = newAttendanceState[usn];
                if (record.status === 'Present' && (now - record.lastSeen > 5000)) { // 5 seconds timeout
                    newAttendanceState[usn] = {
                        ...record,
                        status: 'Left Session'
                    };
                    stateChanged = true;
                    // logAttendanceToDB(studentId, 'Left');
                }
            });

            if (stateChanged) {
                setAttendanceState(newAttendanceState);
            }
        };

        attendanceIntervalRef.current = setInterval(checkAttendance, 1000);

        return () => {
            if (attendanceIntervalRef.current) clearInterval(attendanceIntervalRef.current);
        };
    }, [isMonitoring, faceMatcher, enrolledStudents, attendanceState]);

    // New Engagement Scoring Algorithm
    const calculateEngagement = (expressions) => {
        // Base Score - Starts high because presence itself is good
        let score = 60;

        // Boosters (Positive Engagement)
        // Neutral is "Focused Listening" -> Very Good (+35 max)
        if (expressions.neutral > 0.2) score += (expressions.neutral * 35);

        // Happy/Surprised is "Active Participation" -> Excellent (+40 max)
        if (expressions.happy > 0.2) score += (expressions.happy * 40);
        if (expressions.surprised > 0.2) score += (expressions.surprised * 30);

        // Penalties (Negative/Distracted)
        if (expressions.sad > 0.3) score -= (expressions.sad * 20);
        if (expressions.angry > 0.3) score -= (expressions.angry * 30);
        if (expressions.fearful > 0.3) score -= (expressions.fearful * 30);
        if (expressions.disgusted > 0.3) score -= (expressions.disgusted * 30);

        return Math.max(0, Math.min(100, Math.round(score)));
    };

    // Data Recording Loop (every 30s)
    useEffect(() => {
        if (!isMonitoring) return;

        intervalRef.current = setInterval(() => {
            const currentDetections = detectionsRef.current;

            if (currentDetections.length > 0) {
                const timestamp = new Date();
                const timeElapsed = sessionStartTime
                    ? Math.floor((timestamp - sessionStartTime) / 1000)
                    : 0;

                currentDetections.forEach((detection, index) => {
                    const ex = detection.expressions;
                    const engagementScore = calculateEngagement(ex);
                    const dominantEmotion = Object.keys(ex).reduce((a, b) => ex[a] > ex[b] ? a : b);

                    // Match student
                    let studentName = `Unknown ${index + 1}`;
                    let studentUSN = `UNKNOWN${index + 1}`;

                    if (faceMatcher) {
                        const match = faceMatcher.findBestMatch(detection.descriptor);
                        if (match.label !== 'unknown') {
                            const student = enrolledStudents.find(s => s.usn === match.label);
                            if (student) {
                                studentName = student.name;
                                studentUSN = student.usn;
                            }
                        }
                    }

                    const record = {
                        timestamp: timestamp.toLocaleString(),
                        timeElapsed: `${timeElapsed}s`,
                        studentName,
                        studentUSN,
                        emotion: dominantEmotion,
                        attentivenessScore: engagementScore,
                        faceIndex: index
                    };

                    setSessionData(prev => [...prev, record]);
                });
            }
        }, 30000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isMonitoring, sessionStartTime, enrolledStudents, faceMatcher]);

    const handleStartMonitoring = () => {
        setIsMonitoring(true);
        setSessionStartTime(new Date());
        setSessionData([]);
        setAttendanceState({});
    };

    const handleStopMonitoring = () => {
        setIsMonitoring(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (attendanceIntervalRef.current) clearInterval(attendanceIntervalRef.current);

        // Capture final snapshot if there are detections
        const currentDetections = detectionsRef.current;
        if (currentDetections.length > 0) {
            // Re-use recording logic (simplified for brevity, ideally extract to function)
            const timestamp = new Date();
            const timeElapsed = sessionStartTime ? Math.floor((timestamp - sessionStartTime) / 1000) : 0;

            const newRecords = currentDetections.map((detection, index) => {
                const ex = detection.expressions;
                const engagementScore = calculateEngagement(ex);
                const dominantEmotion = Object.keys(ex).reduce((a, b) => ex[a] > ex[b] ? a : b);

                let studentName = `Unknown ${index + 1}`;
                let studentUSN = `UNKNOWN${index + 1}`;

                if (faceMatcher) {
                    const match = faceMatcher.findBestMatch(detection.descriptor);
                    if (match.label !== 'unknown') {
                        const student = enrolledStudents.find(s => s.usn === match.label);
                        if (student) {
                            studentName = student.name;
                            studentUSN = student.usn;
                        }
                    }
                }

                return {
                    timestamp: timestamp.toLocaleString(),
                    timeElapsed: `${timeElapsed}s`,
                    studentName,
                    studentUSN,
                    emotion: dominantEmotion,
                    attentivenessScore: engagementScore,
                    faceIndex: index
                };
            });

            setSessionData(prev => [...prev, ...newRecords]);
        }
    };

    const handleExport = () => {
        const currentSessionData = sessionDataRef.current;
        if (currentSessionData.length === 0) {
            alert("No session data to export yet!");
            return;
        }

        const studentStats = {};
        currentSessionData.forEach(record => {
            const key = record.studentUSN;
            if (!studentStats[key]) {
                studentStats[key] = {
                    name: record.studentName,
                    usn: record.studentUSN,
                    totalRecords: 0,
                    totalAttentiveness: 0,
                    emotions: {}
                };
            }
            studentStats[key].totalRecords++;
            studentStats[key].totalAttentiveness += record.attentivenessScore;
            studentStats[key].emotions[record.emotion] = (studentStats[key].emotions[record.emotion] || 0) + 1;
        });

        // Main data section
        const headers = ['Timestamp', 'Time Elapsed', 'Student Name', 'USN', 'Emotion', 'Attentiveness Score'];
        let csvContent = headers.join(',') + '\n';
        csvContent += currentSessionData.map(row => [
            `"${row.timestamp}"`, row.timeElapsed, `"${row.studentName}"`, row.studentUSN, row.emotion, row.attentivenessScore
        ].join(',')).join('\n');

        // Attendance section with exit times
        csvContent += '\n\n--- ATTENDANCE LOG ---\n';
        csvContent += 'Student Name,USN,Status,Entry Time,Exit Time\n';
        Object.values(attendanceState).forEach(record => {
            const entryTime = record.firstSeen ? new Date(record.firstSeen).toLocaleString() : 'N/A';
            const exitTime = record.status === 'Left Session' && record.lastSeen
                ? new Date(record.lastSeen).toLocaleString()
                : (record.status === 'Present' ? 'Still Present' : 'N/A');
            csvContent += [`"${record.name}"`, record.usn, record.status, `"${entryTime}"`, `"${exitTime}"`].join(',') + '\n';
        });

        // Overall summary
        csvContent += '\n--- OVERALL SUMMARY ---\n';
        csvContent += 'Student Name,USN,Avg Attentiveness,Dominant Emotion,Total Records\n';
        Object.values(studentStats).forEach(stats => {
            const avgAttentiveness = Math.round(stats.totalAttentiveness / stats.totalRecords);
            const dominantEmotion = Object.keys(stats.emotions).reduce((a, b) => stats.emotions[a] > stats.emotions[b] ? a : b);
            csvContent += [`"${stats.name}"`, stats.usn, avgAttentiveness, dominantEmotion, stats.totalRecords].join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `smartclass_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
        link.click();
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Header */}
            <header className="glass-panel" style={{
                margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎓</span>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Dashboard</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost" onClick={toggleTheme} style={{ boxShadow: 'none' }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setShowEnroll(!showEnroll); if (!showEnroll) fetchEnrolledStudents(); }}>
                        <UserPlus size={20} /> Enroll
                    </button>
                    <button className="btn btn-primary" onClick={handleExport}>
                        Export Report ({sessionData.length})
                    </button>
                    <button className="btn btn-ghost" onClick={handleSignOut}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="container" style={{ padding: '0 1rem 2rem' }}>
                {showEnroll && (
                    <div style={{ marginBottom: '2rem' }}>
                        <EnrollStudent onClose={() => { setShowEnroll(false); fetchEnrolledStudents(); }} />
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid-layout" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Users size={24} /></div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enrolled Students</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{enrolledStudents.length}</div>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Activity size={24} /></div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active Now</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                {Object.values(attendanceState).filter(s => s.status === 'Present').length}
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Clock size={24} /></div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Session Time</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                {sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 60000) + 'm' : '0m'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Left Column: Camera & Live Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                                <button className={`btn ${isMonitoring ? 'btn-ghost' : 'btn-success'}`} onClick={handleStartMonitoring} disabled={isMonitoring}>
                                    <Play size={20} /> Start
                                </button>
                                <button className={`btn ${!isMonitoring ? 'btn-ghost' : 'btn-danger'}`} onClick={handleStopMonitoring} disabled={!isMonitoring}>
                                    <Square size={20} /> Stop
                                </button>
                            </div>
                            {isMonitoring && (
                                <div style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                                    Monitoring Active
                                </div>
                            )}
                        </div>

                        {isMonitoring ? (
                            <>
                                <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                                    <CameraFeed onFacesDetected={setDetections} />
                                </div>

                                {/* Live Student Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {detections.map((detection, i) => {
                                        const score = calculateEngagement(detection.expressions);
                                        const emotion = Object.keys(detection.expressions).reduce((a, b) => detection.expressions[a] > detection.expressions[b] ? a : b);

                                        // Find student name
                                        let name = `Student ${i + 1}`;
                                        if (faceMatcher) {
                                            const match = faceMatcher.findBestMatch(detection.descriptor);
                                            if (match.label !== 'unknown') {
                                                const s = enrolledStudents.find(st => st.usn === match.label);
                                                if (s) name = s.name;
                                            }
                                        }

                                        return (
                                            <div key={i} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${score > 70 ? 'var(--success)' : score > 40 ? 'var(--warning)' : 'var(--danger)'}` }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{name}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                    <span>Emotion:</span>
                                                    <span style={{ textTransform: 'capitalize' }}>{emotion}</span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Engagement: {score}%</div>
                                                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${score}%`,
                                                        height: '100%',
                                                        background: score > 70 ? 'var(--success)' : score > 40 ? 'var(--warning)' : 'var(--danger)',
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📷</div>
                                <h3>Camera Offline</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Start monitoring to view feed</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Attendance List & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Attendance List */}
                        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                            <h3 style={{ marginBottom: '1rem' }}>Live Attendance</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {Object.values(attendanceState).length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No students detected yet</p>
                                ) : (
                                    Object.values(attendanceState).map((record) => (
                                        <div key={record.usn} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.8rem', borderRadius: 'var(--border-radius-sm)',
                                            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{record.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{record.usn}</div>
                                                {record.status === 'Left Session' && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                        Last Seen: {new Date(record.lastSeen).toLocaleTimeString()}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                                                background: record.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: record.status === 'Present' ? '#10b981' : '#ef4444'
                                            }}>
                                                {record.status}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Dashboard Stats */}
                        {isMonitoring && <Dashboard detections={detections} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
