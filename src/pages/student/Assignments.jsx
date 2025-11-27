import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Assignments = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .order('due_date', { ascending: true });

            if (data) setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssignments = assignments.filter(a => a.status === activeTab);

    const TabButton = ({ id, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`pb-3 px-1 relative font-medium text-sm transition-colors ${activeTab === id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            {label} ({count})
            {activeTab === id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
        </button>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'submitted': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'completed': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
                    <p className="text-gray-500 mt-1">Track your progress and complete assignments on time</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                    <FileText size={18} />
                    Create AI Practice
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
                <TabButton id="pending" label="Pending" count={assignments.filter(a => a.status === 'pending').length} />
                <TabButton id="submitted" label="Submitted" count={assignments.filter(a => a.status === 'submitted').length} />
                <TabButton id="completed" label="Completed" count={assignments.filter(a => a.status === 'completed').length} />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
                    <p className="text-gray-500">You're all caught up for now!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAssignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assignment.subject.includes('Math') ? 'bg-blue-50 text-blue-600' :
                                    assignment.subject.includes('Science') ? 'bg-green-50 text-green-600' :
                                        'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    <FileText size={20} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{assignment.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{assignment.description}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-20 text-gray-400">Subject:</span>
                                    <span className="font-medium">{assignment.subject}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-20 text-gray-400">Teacher:</span>
                                    <span className="font-medium">{assignment.teacher}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-20 text-gray-400">Due:</span>
                                    <span className={`font-medium flex items-center gap-1 ${new Date(assignment.due_date) < new Date() ? 'text-red-600' : 'text-gray-900'
                                        }`}>
                                        <Calendar size={14} />
                                        {new Date(assignment.due_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Start Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Assignments;
