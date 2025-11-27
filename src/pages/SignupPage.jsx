import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Hash, AlertCircle, CheckCircle } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        name: '',
        usn: '' // For students
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.role === 'student' && !formData.usn) {
            setError('USN is required for students');
            return;
        }

        setLoading(true);

        try {
            const metadata = {
                name: formData.name,
                ...(formData.role === 'student' && { usn: formData.usn })
            };

            const { data, error } = await signUp(
                formData.email,
                formData.password,
                formData.role,
                metadata
            );

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="glass-panel animate-scale" style={{
                maxWidth: '500px',
                width: '100%',
                padding: '3rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join SmartClass Monitor</p>
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

                {success && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid var(--success)',
                        borderRadius: 'var(--border-radius-sm)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--success)'
                    }}>
                        <CheckCircle size={20} />
                        <span>Account created! Redirecting to login...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>
                            <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {formData.role === 'student' && (
                        <div className="input-group">
                            <label>
                                <Hash size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                USN (University Seat Number)
                            </label>
                            <input
                                type="text"
                                name="usn"
                                value={formData.usn}
                                onChange={handleChange}
                                placeholder="1XX21CS001"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading || success}
                    >
                        <UserPlus size={20} />
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                        Sign in
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

export default SignupPage;
