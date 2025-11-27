import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, BookOpen, Users,
    Lightbulb, GraduationCap, Wrench, LogOut,
    Bell, Search, Zap, Moon, Sun, User, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import StudentDashboard from './StudentDashboard';
import Assignments from './Assignments';
import AssignmentDetail from './AssignmentDetail';
import Notes from './Notes';
import Assistants from './Assistants';
import AITutor from './AITutor';

import Tools from './Tools';

const StudentLayout = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const SidebarItem = ({ icon: Icon, label, path, badge }) => {
        const isActive = location.pathname === path;
        return (
            <div
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
            >
                <Icon size={20} />
                <span className="flex-1">{label}</span>
                {badge && (
                    <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium dark:bg-indigo-900 dark:text-indigo-300">
                        {badge}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FC] dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 fixed h-full hidden md:flex flex-col transition-colors duration-200">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">SmartClass</span>
                </div>

                <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</div>
                        <div className="space-y-1">
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/student/dashboard" />
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Student Space</div>
                        <div className="space-y-1">
                            <SidebarItem icon={FileText} label="My Assignments" path="/student/assignments" badge="3" />
                            <SidebarItem icon={BookOpen} label="My Notes" path="/student/notes" />
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">AI Corner</div>
                        <div className="space-y-1">
                            <SidebarItem icon={Users} label="Assistants" path="/student/assistants" />
                            <SidebarItem icon={Wrench} label="Tools" path="/student/tools" />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 transition-colors duration-200">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-4 flex justify-between items-center sticky top-0 z-10 transition-colors duration-200">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                                    {user?.email?.[0].toUpperCase() || 'S'}
                                </div>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Student Account</p>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                    >
                                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                        <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                                    </button>
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </button>
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <User size={18} />
                                        <span>Profile</span>
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                        <button
                                            onClick={signOut}
                                            className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400"
                                        >
                                            <LogOut size={18} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/assignment/:id" element={<AssignmentDetail />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/assistants" element={<Assistants />} />
                    <Route path="/assistant/:id" element={<AITutor />} />
                    <Route path="/tools" element={<Tools />} />
                </Routes>
            </main>
        </div>
    );
};

export default StudentLayout;
