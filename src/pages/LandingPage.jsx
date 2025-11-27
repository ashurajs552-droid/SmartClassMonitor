import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Users, TrendingUp, Shield, Zap, Eye } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <section className="hero" style={{
                padding: '6rem 2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.1), transparent 70%)'
            }}>
                <div className="container">
                    <div className="animate-fade-in">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                            SmartClass Monitor
                        </h1>
                        <p style={{
                            fontSize: '1.5rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '800px',
                            margin: '0 auto 2rem',
                            lineHeight: '1.6'
                        }}>
                            AI-Powered Classroom Analytics & Attendance Management
                        </p>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'var(--text-muted)',
                            maxWidth: '700px',
                            margin: '0 auto 3rem'
                        }}>
                            Revolutionize education with real-time emotion detection, automatic attendance tracking,
                            and comprehensive student engagement analytics.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                                Get Started
                            </Link>
                            <Link to="/signup" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        Powerful Features
                    </h2>
                    <div className="grid-layout">
                        <FeatureCard
                            icon={<Brain size={40} />}
                            title="AI Emotion Detection"
                            description="Advanced facial recognition analyzes 7 emotions in real-time to measure student engagement and attentiveness."
                        />
                        <FeatureCard
                            icon={<Users size={40} />}
                            title="Auto Attendance"
                            description="Automatically mark attendance by recognizing enrolled students. No manual roll calls needed."
                        />
                        <FeatureCard
                            icon={<TrendingUp size={40} />}
                            title="Analytics Dashboard"
                            description="Comprehensive insights into class performance, engagement trends, and individual student progress."
                        />
                        <FeatureCard
                            icon={<Shield size={40} />}
                            title="Role-Based Access"
                            description="Secure access control for students, teachers, and administrators with tailored dashboards."
                        />
                        <FeatureCard
                            icon={<Zap size={40} />}
                            title="Real-Time Processing"
                            description="Process 50-60 faces simultaneously with instant emotion analysis and attentiveness scoring."
                        />
                        <FeatureCard
                            icon={<Eye size={40} />}
                            title="Historical Reports"
                            description="Export detailed CSV reports and track performance trends over time with visual analytics."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '6rem 2rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        How It Works
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
                        <StepCard
                            number="1"
                            title="Enroll Students"
                            description="Admin captures student faces to create a secure biometric database."
                        />
                        <StepCard
                            number="2"
                            title="Start Monitoring"
                            description="Camera analyzes classroom in real-time, detecting faces and emotions."
                        />
                        <StepCard
                            number="3"
                            title="Track Engagement"
                            description="AI calculates attentiveness scores based on emotional expressions."
                        />
                        <StepCard
                            number="4"
                            title="Generate Insights"
                            description="View analytics, export reports, and make data-driven decisions."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '6rem 2rem',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>
                        Ready to Transform Your Classroom?
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
                        Join thousands of educators using SmartClass Monitor
                    </p>
                    <Link to="/signup" className="btn" style={{
                        background: 'white',
                        color: 'var(--accent-primary)',
                        fontSize: '1.1rem',
                        padding: '1rem 2.5rem'
                    }}>
                        Start Free Trial
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '3rem 2rem',
                background: 'var(--bg-secondary)',
                textAlign: 'center',
                color: 'var(--text-secondary)'
            }}>
                <p>&copy; 2025 SmartClass Monitor. All rights reserved.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-panel animate-scale" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
            color: 'var(--accent-primary)',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
    </div>
);

const StepCard = ({ number, title, description }) => (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
        }}>
            {number}
        </div>
        <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
);

export default LandingPage;
