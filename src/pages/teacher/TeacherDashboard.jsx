import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Search, Download, Moon, Sun,
    Users, FileText, GraduationCap, Plus, X, Check
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

const TeacherDashboard = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('students');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Data States
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState([]);

    // Modal States
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showGradeModal, setShowGradeModal] = useState(false);

    // Form States
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        subject: '',
        description: '',
        due_date: '',
        total_points: 100
    });

    const [newGrade, setNewGrade] = useState({
        student_id: '',
        assignment_id: '',
        score: '',
        feedback: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'students') {
                const { data } = await supabase.from('students').select('*').order('enrolled_at', { ascending: false });
                setStudents(data || []);
            } else if (activeTab === 'assignments') {
                const { data } = await supabase.from('assignments').select('*').order('due_date', { ascending: true });
                setAssignments(data || []);
            } else if (activeTab === 'grades') {
                const { data } = await supabase
                    .from('grades')
                    .select(`
                        *,
                        student:students(name, usn),
                        assignment:assignments(title, subject)
                    `)
                    .order('graded_at', { ascending: false });
                setGrades(data || []);

                // Also fetch students and assignments for the dropdowns
                if (students.length === 0) {
                    const { data: sData } = await supabase.from('students').select('*');
                    setStudents(sData || []);
                }
                if (assignments.length === 0) {
                    const { data: aData } = await supabase.from('assignments').select('*');
                    setAssignments(aData || []);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('assignments').insert([newAssignment]);
            if (error) throw error;
            setShowAssignmentModal(false);
            setNewAssignment({ title: '', subject: '', description: '', due_date: '', total_points: 100 });
            fetchData();
        } catch (error) {
            alert('Error creating assignment: ' + error.message);
        }
    };

    const handleAddGrade = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('grades').insert([{
                student_id: newGrade.student_id,
                assignment_id: newGrade.assignment_id,
                score: parseInt(newGrade.score),
                feedback: newGrade.feedback,
                graded_at: new Date().toISOString()
            }]);
            if (error) throw error;
            setShowGradeModal(false);
            setNewGrade({ student_id: '', assignment_id: '', score: '', feedback: '' });
            fetchData();
        } catch (error) {
            alert('Error adding grade: ' + error.message);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const exportData = () => {
        // Simple export logic based on active tab
        let content = '';
        let filename = '';

        if (activeTab === 'students') {
            content = ['Name,USN,Email', ...students.map(s => `"${s.name}",${s.usn},${s.email}`)].join('\n');
            filename = 'students.csv';
        } else if (activeTab === 'assignments') {
            content = ['Title,Subject,Due Date,Points', ...assignments.map(a => `"${a.title}",${a.subject},${a.due_date},${a.total_points}`)].join('\n');
            filename = 'assignments.csv';
        } else {
            content = ['Student,Assignment,Score,Feedback', ...grades.map(g => `"${g.student?.name}","${g.assignment?.title}",${g.score},"${g.feedback}"`)].join('\n');
            filename = 'grades.csv';
        }

        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                        👨‍🏫
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                        <Download size={18} />
                        Export
                    </button>
                    <button onClick={handleSignOut} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'students'
                                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <Users size={18} /> Students
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'assignments'
                                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <FileText size={18} /> Assignments
                    </button>
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'grades'
                                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <GraduationCap size={18} /> Grades
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>

                        {activeTab === 'assignments' && (
                            <button
                                onClick={() => setShowAssignmentModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Assignment
                            </button>
                        )}

                        {activeTab === 'grades' && (
                            <button
                                onClick={() => setShowGradeModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Grade
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <tr>
                                    {activeTab === 'students' && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">Name</th>
                                            <th className="px-6 py-4 font-semibold">USN</th>
                                            <th className="px-6 py-4 font-semibold">Email</th>
                                            <th className="px-6 py-4 font-semibold">Enrolled</th>
                                        </>
                                    )}
                                    {activeTab === 'assignments' && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">Title</th>
                                            <th className="px-6 py-4 font-semibold">Subject</th>
                                            <th className="px-6 py-4 font-semibold">Due Date</th>
                                            <th className="px-6 py-4 font-semibold">Points</th>
                                        </>
                                    )}
                                    {activeTab === 'grades' && (
                                        <>
                                            <th className="px-6 py-4 font-semibold">Student</th>
                                            <th className="px-6 py-4 font-semibold">Assignment</th>
                                            <th className="px-6 py-4 font-semibold">Score</th>
                                            <th className="px-6 py-4 font-semibold">Feedback</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                                    </tr>
                                ) : (
                                    <>
                                        {activeTab === 'students' && students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(student => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{student.name}</td>
                                                <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-mono">{student.usn}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.email}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(student.enrolled_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}

                                        {activeTab === 'assignments' && assignments.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(assignment => (
                                            <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{assignment.title}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{assignment.subject}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(assignment.due_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-mono">{assignment.total_points}</td>
                                            </tr>
                                        ))}

                                        {activeTab === 'grades' && grades.filter(g => g.student?.name.toLowerCase().includes(searchQuery.toLowerCase())).map(grade => (
                                            <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{grade.student?.name}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{grade.assignment?.title}</td>
                                                <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">{grade.score}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate max-w-xs">{grade.feedback}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add New Assignment</h3>
                            <button onClick={() => setShowAssignmentModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newAssignment.title}
                                    onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={newAssignment.subject}
                                    onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newAssignment.due_date}
                                        onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Points</label>
                                    <input
                                        type="number"
                                        required
                                        value={newAssignment.total_points}
                                        onChange={e => setNewAssignment({ ...newAssignment, total_points: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={newAssignment.description}
                                    onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 mt-4">
                                Create Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Grade Modal */}
            {showGradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add Grade</h3>
                            <button onClick={() => setShowGradeModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddGrade} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Student</label>
                                <select
                                    required
                                    value={newGrade.student_id}
                                    onChange={e => setNewGrade({ ...newGrade, student_id: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.usn})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assignment</label>
                                <select
                                    required
                                    value={newGrade.assignment_id}
                                    onChange={e => setNewGrade({ ...newGrade, assignment_id: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                >
                                    <option value="">Select Assignment</option>
                                    {assignments.map(a => (
                                        <option key={a.id} value={a.id}>{a.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Score</label>
                                <input
                                    type="number"
                                    required
                                    value={newGrade.score}
                                    onChange={e => setNewGrade({ ...newGrade, score: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Feedback</label>
                                <textarea
                                    rows="3"
                                    value={newGrade.feedback}
                                    onChange={e => setNewGrade({ ...newGrade, feedback: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 mt-4">
                                Submit Grade
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
