import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Upload } from 'lucide-react';

const AITutor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Expanded configuration for all assistant types
    const tutorConfig = {
        math: {
            title: 'Math Tutor',
            subtitle: 'Expert help with algebra, geometry, calculus, and all math topics',
            icon: '⚡',
            color: 'bg-indigo-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Linear Algebra', 'Calculus I', 'Discrete Mathematics'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Calculus II', 'Probability & Statistics', 'Differential Equations'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Advanced Calculus', 'Numerical Methods', 'Optimization'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Complex Analysis', 'Transform Techniques', 'Graph Theory'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Operations Research', 'Cryptography', 'Advanced Statistics'] }
            ]
        },
        coding: {
            title: 'Coding Mentor',
            subtitle: 'Python • Grade 12',
            icon: '💻',
            color: 'bg-blue-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Python Basics', 'Data Structures', 'OOP Concepts'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Advanced Python', 'File Handling', 'Exception Handling'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Django Framework', 'REST APIs', 'Database Integration'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Machine Learning with Python', 'NumPy & Pandas', 'Data Visualization'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Deep Learning', 'TensorFlow', 'Project Development'] }
            ]
        },
        science: {
            title: 'Science Helper',
            subtitle: 'Assistance with biology, chemistry, physics, and earth science',
            icon: '🔬',
            color: 'bg-green-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Engineering Physics', 'Thermodynamics', 'Optics'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Quantum Mechanics', 'Electromagnetism', 'Modern Physics'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Solid State Physics', 'Nuclear Physics'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Semiconductor Physics', 'Photonics'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Advanced Physics Topics', 'Research Methods'] }
            ]
        },
        writing: {
            title: 'Writing Coach',
            subtitle: 'Improve your lab reports, project documentation, and essays',
            icon: '✍️',
            color: 'bg-purple-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Technical Report Writing', 'Lab Manuals'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Project Proposals', 'Literature Review'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Research Papers', 'Documentation'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Thesis Writing', 'Presentations'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Final Project Report', 'Journal Papers'] }
            ]
        },
        history: {
            title: 'History Guide',
            subtitle: 'Explore history and constitution of India (CIP)',
            icon: '🌍',
            color: 'bg-orange-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Constitution of India', 'Fundamental Rights'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Professional Ethics', 'Cyber Law'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Intellectual Property Rights'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Indian History', 'Culture'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Global History', 'Geopolitics'] }
            ]
        },
        language: {
            title: 'Language Tutor',
            subtitle: 'Learn Kannada (Kali/Manasu) and Professional English',
            icon: '🗣️',
            color: 'bg-pink-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Kannada Kali', 'Kannada Manasu'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Professional English', 'Communication Skills'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Technical English', 'Vocabulary'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Foreign Languages', 'German/French Basics'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Advanced Communication', 'Public Speaking'] }
            ]
        },
        tutor: {
            title: 'Master Tutor',
            subtitle: 'General guidance for all your academic needs',
            icon: '🎓',
            color: 'bg-teal-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Study Skills', 'Time Management'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Exam Preparation', 'Note Taking'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Research Methodology', 'Career Planning'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Internship Guide', 'Interview Prep'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Higher Studies', 'GRE/TOEFL Prep'] }
            ]
        },
        homework: {
            title: 'Homework Helper',
            subtitle: 'Get unstuck on your assignments and problem sets',
            icon: '📚',
            color: 'bg-red-600',
            grades: [
                { id: 'sem3', label: 'Semester 3', topics: ['Assignment Help', 'Problem Solving'] },
                { id: 'sem4', label: 'Semester 4', topics: ['Project Assistance', 'Code Debugging'] },
                { id: 'sem5', label: 'Semester 5', topics: ['Lab Record Help', 'Viva Questions'] },
                { id: 'sem6', label: 'Semester 6', topics: ['Mini Project', 'Case Studies'] },
                { id: 'sem7', label: 'Semester 7', topics: ['Final Project', 'Thesis Support'] }
            ]
        }
    };

    const config = tutorConfig[id] || tutorConfig.math;
    const currentGrade = config.grades.find(g => g.id === selectedGrade);

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setShowChat(true);
        setMessages([{
            role: 'assistant',
            content: `Hello! I'm your ${config.title}. I'm ready to help you with **${topic}**. What specific question do you have?`
        }]);
    };

    const generateResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();

        // Simulated AI Logic for "Accurate Answers"
        if (lowerInput.includes('python') || lowerInput.includes('code')) {
            return "Here is a Python example for that:\n```python\ndef solve_problem():\n    # Implementation here\n    return 'Success'\n```\nMake sure to handle edge cases like empty inputs!";
        }
        if (lowerInput.includes('calculus') || lowerInput.includes('derivative')) {
            return "The derivative represents the rate of change. For f(x) = x², f'(x) = 2x. This tells us the slope of the tangent line at any point x.";
        }
        if (lowerInput.includes('matrix') || lowerInput.includes('linear algebra')) {
            return "A matrix is a rectangular array of numbers. For matrix multiplication, the number of columns in the first matrix must equal the number of rows in the second.";
        }
        if (lowerInput.includes('physics') || lowerInput.includes('force')) {
            return "According to Newton's Second Law, F = ma. Force equals mass times acceleration. This is fundamental to classical mechanics.";
        }
        if (lowerInput.includes('history') || lowerInput.includes('constitution')) {
            return "The Constitution of India was adopted on November 26, 1949, and came into effect on January 26, 1950. Dr. B.R. Ambedkar was the chairman of the drafting committee.";
        }
        if (lowerInput.includes('django')) {
            return "Django is a high-level Python web framework. To start a project, run `django-admin startproject myproject`. It follows the MVT (Model-View-Template) architecture.";
        }

        return `That's a great question about ${selectedTopic}. To answer accurately: \n\n1. First, consider the fundamental principles of ${selectedTopic}.\n2. Apply the specific formula or logic required.\n3. Verify your result.\n\nWould you like me to elaborate on any specific part?`;
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const response = generateResponse(userMsg.content);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    if (showChat) {
        return (
            <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 m-4 animate-fade-in">
                {/* Header */}
                <div className={`${config.color} text-white p-6 rounded-t-2xl`}>
                    <button
                        onClick={() => setShowChat(false)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Change Topic
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-md shadow-inner">
                            {config.icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{config.title}</h1>
                            <p className="text-white/90">{selectedTopic} • {currentGrade?.label}</p>
                        </div>
                    </div>
                </div>

                {/* Capabilities */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex gap-4 text-sm overflow-x-auto">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            <Sparkles size={14} className="text-yellow-500" />
                            AI Powered
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-600 flex gap-2 items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                    <div className="flex gap-3">
                        <button className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Upload size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Ask about ${selectedTopic}...`}
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                            Send
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/student/assistants')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Assistants
            </button>

            <div className={`${config.color} text-white p-8 rounded-2xl mb-8 shadow-lg relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-md shadow-inner">
                        {config.icon}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
                        <p className="text-white/90 text-lg">{config.subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Topic</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Select what you need help with to get started with personalized assistance</p>

                {/* Grade Level Selector */}
                <div className="mb-8 max-w-md">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Grade Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">Select Semester</option>
                            {config.grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            ▼
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        This helps the AI provide age-appropriate explanations and examples
                    </p>
                </div>

                {/* Topics */}
                {selectedGrade && (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-2 mb-6 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg w-fit">
                            <Sparkles size={16} />
                            Showing topics appropriate for {currentGrade?.label} based on VTU curriculum standards
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentGrade?.topics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTopicSelect(topic)}
                                    className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700 rounded-xl text-left transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <Sparkles size={20} />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{topic}</span>
                                    </div>
                                </button>
                            ))}
                            <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2">
                                <span>+ Other Topic</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITutor;
