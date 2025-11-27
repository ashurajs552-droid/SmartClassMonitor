import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AssignmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [answers, setAnswers] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            const { data } = await supabase
                .from('assignments')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setAssignment(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Update assignment status
        await supabase
            .from('assignments')
            .update({ status: 'submitted' })
            .eq('id', id);

        alert('Assignment submitted successfully!');
        navigate('/student/assignments');
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!assignment) return <div className="p-8">Assignment not found</div>;

    // Sample questions based on subject
    const questions = assignment.subject.includes('Algebra') || assignment.subject.includes('Math') ? [
        { q: 'Solve for x: 2x + 5 = 15', pts: 25 },
        { q: 'Simplify: (3x² + 2x - 1) - (x² - 4x + 3)', pts: 25 },
        { q: 'Factor: x² - 9', pts: 25 },
        { q: 'Solve the system: x + y = 10, 2x - y = 5', pts: 25 }
    ] : assignment.subject.includes('Python') ? [
        { q: 'Write a function to reverse a string', pts: 25 },
        { q: 'Implement bubble sort algorithm', pts: 25 },
        { q: 'Create a class for a Bank Account', pts: 25 },
        { q: 'Write a program to find prime numbers', pts: 25 }
    ] : [
        { q: assignment.description, pts: assignment.points }
    ];

    return (
        <div className="p-8 animate-fade-in">
            <button
                onClick={() => navigate('/student/assignments')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Assignments
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                                <p className="text-gray-500 mt-1">{assignment.subject}</p>
                                <p className="text-sm text-gray-400">Assigned by: {assignment.teacher}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-indigo-600">{assignment.points} points</div>
                                <div className="text-sm text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Assignment Details</h2>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Solve each problem step by step. Show your work for partial credit.
                                You can either type your answers or upload a photo of your handwritten work.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-4">Questions:</h3>
                            <div className="space-y-4">
                                {questions.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">{idx + 1}. {item.q}</span>
                                        </div>
                                        <span className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                                            {item.pts} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Submit Work */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Your Work</h2>

                        <div className="space-y-4">
                            <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                <FileText size={20} />
                                Type Answers
                            </button>

                            <button className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Upload size={20} />
                                Upload Photo
                            </button>
                        </div>

                        <div className="mt-6">
                            <textarea
                                value={answers}
                                onChange={(e) => setAnswers(e.target.value)}
                                placeholder="Type your answers here... (e.g., Question 1: x = ..., Question 2: ...)"
                                className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleSubmit}
                                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Submit Answers
                            </button>
                            <button className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetail;
