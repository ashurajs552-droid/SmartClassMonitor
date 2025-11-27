import React, { useMemo } from 'react';

const Dashboard = ({ detections }) => {
    const stats = useMemo(() => {
        if (!detections || detections.length === 0) return null;

        const totalStudents = detections.length;
        let totalAttentiveness = 0;
        const emotions = {
            neutral: 0,
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            sleepy: 0
        };

        detections.forEach(d => {
            const ex = d.expressions;

            // Detect sleepy state (low overall expression values indicate drowsiness)
            const totalExpressionValue = Object.values(ex).reduce((sum, val) => sum + val, 0);
            const avgExpression = totalExpressionValue / Object.keys(ex).length;
            const isSleepy = avgExpression < 0.3 && ex.neutral > 0.5;

            if (isSleepy) {
                emotions.sleepy++;
            } else {
                // Find dominant emotion
                const dominant = Object.keys(ex).reduce((a, b) => ex[a] > ex[b] ? a : b);
                if (emotions[dominant] !== undefined) {
                    emotions[dominant]++;
                }
            }

            // Improved attentiveness calculation
            // Weighted scoring system based on emotion intensity and type
            let attentivenessValue = 0;

            if (isSleepy) {
                // Sleepy students get very low score
                attentivenessValue = 0.1;
            } else {
                // Positive emotions indicate high attentiveness
                if (ex.happy > 0.5) attentivenessValue += ex.happy * 0.9;
                if (ex.surprised > 0.4) attentivenessValue += ex.surprised * 0.8;
                if (ex.neutral > 0.6) attentivenessValue += ex.neutral * 0.7;

                // Negative emotions reduce attentiveness
                if (ex.sad > 0.4) attentivenessValue -= ex.sad * 0.5;
                if (ex.angry > 0.4) attentivenessValue -= ex.angry * 0.6;
                if (ex.fearful > 0.4) attentivenessValue -= ex.fearful * 0.4;
                if (ex.disgusted > 0.4) attentivenessValue -= ex.disgusted * 0.5;

                // Normalize to 0-1 range
                attentivenessValue = Math.max(0, Math.min(1, attentivenessValue));
            }

            totalAttentiveness += attentivenessValue;
        });

        const attentivenessScore = Math.round((totalAttentiveness / totalStudents) * 100);

        return { totalStudents, attentivenessScore, emotions };
    }, [detections]);

    if (!stats) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Waiting for students...</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Camera is active. Looking for faces to analyze.</p>
            </div>
        );
    }

    const getEmotionColor = (emotion) => {
        const colors = {
            neutral: 'var(--accent-primary)',
            happy: 'var(--success)',
            sad: '#6366f1',
            angry: 'var(--danger)',
            fearful: '#f59e0b',
            disgusted: '#8b5cf6',
            surprised: '#06b6d4',
            sleepy: '#ef4444'
        };
        return colors[emotion] || 'var(--accent-secondary)';
    };

    const getEmotionIcon = (emotion) => {
        const icons = {
            neutral: '😐',
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fearful: '😨',
            disgusted: '🤢',
            surprised: '😲',
            sleepy: '😴'
        };
        return icons[emotion] || '😐';
    };

    return (
        <div className="grid-layout" style={{ marginTop: '2rem' }}>
            {/* Key Metrics */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Active Students
                </h4>
                <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {stats.totalStudents}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Attentiveness Score
                </h4>
                <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    color: stats.attentivenessScore > 70 ? 'var(--success)' :
                        stats.attentivenessScore > 40 ? 'var(--warning)' :
                            'var(--danger)'
                }}>
                    {stats.attentivenessScore}%
                </div>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.5rem',
                    textAlign: 'center'
                }}>
                    {stats.attentivenessScore > 70 ? '🎯 Excellent Focus' :
                        stats.attentivenessScore > 40 ? '⚠️ Moderate Focus' :
                            '❌ Low Focus'}
                </p>
            </div>

            {/* Emotions Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Live Emotion Analysis</h4>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                    {Object.entries(stats.emotions).map(([emotion, count]) => (
                        <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '90px',
                                textTransform: 'capitalize',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>{getEmotionIcon(emotion)}</span>
                                <span>{emotion}</span>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0}%`,
                                    height: '100%',
                                    background: getEmotionColor(emotion),
                                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: count > 0 ? `0 0 8px ${getEmotionColor(emotion)}` : 'none'
                                }} />
                            </div>
                            <div style={{
                                width: '40px',
                                textAlign: 'right',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: count > 0 ? getEmotionColor(emotion) : 'var(--text-secondary)'
                            }}>
                                {count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alert for sleepy students */}
            {stats.emotions.sleepy > 0 && (
                <div className="glass-panel" style={{
                    padding: '1.5rem',
                    gridColumn: 'span 1',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--danger)'
                }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--danger)' }}>
                        ⚠️ Alert: Sleepy Students Detected
                    </h4>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {stats.emotions.sleepy} student{stats.emotions.sleepy > 1 ? 's' : ''} appear{stats.emotions.sleepy === 1 ? 's' : ''} to be drowsy or inattentive.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
