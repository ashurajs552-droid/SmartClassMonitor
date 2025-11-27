import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error } = await signIn(email, password);

            if (error) throw error;

            // Get user role from metadata
            const role = data.user?.user_metadata?.role || 'student';

            // Navigate based on role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.message === 'Invalid login credentials') {
                setError('Invalid credentials. If you just signed up, please check your email for a confirmation link (or ask admin to disable email confirmation).');
            } else {
                setError(err.message || 'Failed to sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const { error } = await signInWithGoogle('student');
            if (error) throw error;
            // Google OAuth will redirect automatically
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="glass-panel animate-scale" style={{
                maxWidth: '450px',
                width: '100%',
                padding: '3rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        borderRadius: 'var(--border-radius-sm)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--danger)'
                    }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        <LogIn size={20} />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '2rem 0',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    <span>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="btn"
                    style={{
                        width: '100%',
                        background: 'white',
                        color: '#1f1f1f',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem'
                    }}
                    disabled={loading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                        Sign up
                    </Link>
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
