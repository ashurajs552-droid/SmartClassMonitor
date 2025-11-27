import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const role = user.user_metadata?.role || 'student';

            // Navigate based on role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        }
    }, [user, navigate]);

    return (
        <div className="flex-center" style={{ minHeight: '100vh' }}>
            <div className="animate-pulse" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                <h3>Completing sign in...</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Please wait while we redirect you
                </p>
            </div>
        </div>
    );
};

export default AuthCallback;
