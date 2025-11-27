import React, { useState } from 'react';
import {
    Code, Calculator, BookOpen, Globe,
    PenTool, GraduationCap, Microscope, Languages
} from 'lucide-react';
import AIChatModal from './components/AIChatModal';

import { useNavigate } from 'react-router-dom';

const Assistants = () => {
    const navigate = useNavigate();

    const assistants = [
        {
            id: 'coding',
            title: 'Coding Mentor',
            subject: 'Python & Algorithms',
            icon: Code,
            color: 'bg-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            desc: 'Expert in Python, Data Structures, and VTU Lab Programs.'
        },
        {
            id: 'math',
            title: 'Math Tutor',
            subject: 'Engineering Mathematics',
            icon: Calculator,
            color: 'bg-indigo-600',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            desc: 'Help with Calculus, Linear Algebra, and Probability.'
        },
        {
            id: 'science',
            title: 'Science Helper',
            subject: 'Physics & Chemistry',
            icon: Microscope,
            color: 'bg-green-600',
            bg: 'bg-green-50',
            text: 'text-green-600',
            desc: 'Assistance with Engineering Physics and Chemistry cycles.'
        },
        {
            id: 'writing',
            title: 'Writing Coach',
            subject: 'Technical Writing',
            icon: PenTool,
            color: 'bg-purple-600',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            desc: 'Improve your lab reports, project documentation, and essays.'
        },
        {
            id: 'history',
            title: 'History Guide',
            subject: 'Social Studies',
            icon: Globe,
            color: 'bg-orange-600',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            desc: 'Explore history and constitution of India (CIP).'
        },
        {
            id: 'language',
            title: 'Language Tutor',
            subject: 'Kannada & English',
            icon: Languages,
            color: 'bg-pink-600',
            bg: 'bg-pink-50',
            text: 'text-pink-600',
            desc: 'Learn Kannada (Kali/Manasu) and Professional English.'
        },
        {
            id: 'tutor',
            title: 'Master Tutor',
            subject: 'All Subjects',
            icon: GraduationCap,
            color: 'bg-teal-600',
            bg: 'bg-teal-50',
            text: 'text-teal-600',
            desc: 'General guidance for all your academic needs.'
        },
        {
            id: 'homework',
            title: 'Homework Helper',
            subject: 'Assignments',
            icon: BookOpen,
            color: 'bg-red-600',
            bg: 'bg-red-50',
            text: 'text-red-600',
            desc: 'Get unstuck on your assignments and problem sets.'
        }
    ];

    return (
        <div className="p-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistants</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a specialized AI tutor to help you with your VTU studies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {assistants.map((assistant) => (
                    <div
                        key={assistant.id}
                        onClick={() => navigate(`/student/assistant/${assistant.id}`)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 group"
                    >
                        <div className={`w-12 h-12 ${assistant.bg} ${assistant.text} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <assistant.icon size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{assistant.title}</h3>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">{assistant.subject}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{assistant.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assistants;
