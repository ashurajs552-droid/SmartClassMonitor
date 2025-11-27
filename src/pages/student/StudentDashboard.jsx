import React, { useState, useEffect } from 'react';
import {
    FileText, TrendingUp, CheckCircle, Zap, Clock, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState({
        attendanceRate: 0,
        avgAttentiveness: 0,
        totalClasses: 0,
        hasData: false
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Student Profile
            const { data: student } = await supabase
                .from('students')
                .select('*')
                .eq('email', user?.email)
                .single();

            if (student) {
                setStudentData(student);

                // 2. Fetch Real Attendance Data
                const { data: attendance } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('student_id', student.id);

                if (attendance && attendance.length > 0) {
                    const total = attendance.length;
                    const present = attendance.filter(a => a.present).length;
                    const avgAtt = attendance.reduce((acc, curr) => acc + (curr.attentiveness_score || 0), 0) / total;

                    setAttendanceStats({
                        attendanceRate: Math.round((present / total) * 100),
                        avgAttentiveness: Math.round(avgAtt),
                        totalClasses: total,
                        hasData: true
                    });
                } else {
                    setAttendanceStats({
                        attendanceRate: 0,
                        avgAttentiveness: 0,
                        totalClasses: 0,
                        hasData: false
                    });
                }
            }

            // 3. Fetch Assignments
            const { data: assignData } = await supabase
                .from('assignments')
                .select('*')
                .eq('status', 'pending')
                .order('due_date', { ascending: true })
                .limit(3);
            if (assignData) setAssignments(assignData);

            // 4. Fetch Grades
            const { data: gradeData } = await supabase
                .from('grades')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (gradeData) setGrades(gradeData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, bgClass, showAlert }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className={`text-sm font-medium ${subtitle.includes('+') ? 'text-green-600' : showAlert ? 'text-amber-600' : 'text-gray-500'} flex items-center gap-1`}>
                {showAlert && <AlertCircle size={14} />}
                {subtitle}
            </div>
        </div>
    );

    const avgGrade = grades.length > 0
        ? Math.round(grades.reduce((acc, g) => acc + (g.score / g.max_score * 100), 0) / grades.length)
        : 92; // Default demo value

    return (
        <div className="p-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your AI-powered learning overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Assignments Due"
                    value={assignments.length}
                    subtitle={assignments.length === 0 ? "No pending assignments" : "This week"}
                    icon={FileText}
                    bgClass="bg-indigo-50"
                    colorClass="text-indigo-600"
                    showAlert={false}
                />
                <StatCard
                    title="Average Grade"
                    value={`${avgGrade}%`}
                    subtitle={grades.length === 0 ? "No grades yet" : "+2% from last month"}
                    icon={TrendingUp}
                    bgClass="bg-purple-50"
                    colorClass="text-purple-600"
                    showAlert={grades.length === 0}
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${attendanceStats.attendanceRate}%`}
                    subtitle={!attendanceStats.hasData ? "No attendance data recorded" : "On-time arrival"}
                    icon={CheckCircle}
                    bgClass="bg-green-50"
                    colorClass="text-green-600"
                    showAlert={!attendanceStats.hasData}
                />
                <StatCard
                    title="Avg Attentiveness"
                    value={`${attendanceStats.avgAttentiveness}%`}
                    subtitle={!attendanceStats.hasData ? "Start attending classes to track" : "Keep it up!"}
                    icon={Zap}
                    bgClass="bg-amber-50"
                    colorClass="text-amber-600"
                    showAlert={!attendanceStats.hasData}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Assignments */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Upcoming Assignments</h2>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                    </div>
                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No pending assignments</p>
                                <p className="text-xs text-gray-400 mt-1">Run vtu-aiml-setup.sql to add sample data</p>
                            </div>
                        ) : (
                            assignments.map((assign, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm group-hover:text-indigo-600 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{assign.title}</h4>
                                            <div className="text-sm text-gray-500">{assign.subject}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-indigo-600">{assign.points} pts</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                                            <Clock size={12} />
                                            {new Date(assign.due_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Grades */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Grades</h2>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                    </div>
                    <div className="space-y-6">
                        {grades.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                <TrendingUp size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No grades available</p>
                                <p className="text-xs text-gray-400 mt-1">Run vtu-aiml-setup.sql to add sample data</p>
                            </div>
                        ) : (
                            grades.map((grade, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{grade.title}</h4>
                                            <div className="text-sm text-gray-500">{grade.subject}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">{grade.score}</span>
                                            <span className="text-sm text-gray-500">/{grade.max_score}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full"
                                            style={{ width: `${(grade.score / grade.max_score) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
