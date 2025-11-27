import React, { useState } from 'react';
import {
    Sparkles, Star, Search, FileText, BookOpen, Calculator,
    Lightbulb, PenTool, Languages, Brain, Zap, MessageSquare
} from 'lucide-react';

const Tools = () => {
    const [selectedTool, setSelectedTool] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Tools');

    const tools = [
        {
            id: 'worksheet',
            name: 'Worksheet Generator',
            description: 'Create custom worksheets with practice problems tailored to VTU AIML syllabus',
            category: 'Practice',
            icon: FileText,
            color: 'bg-blue-600',
            features: ['Custom difficulty levels', 'Multiple subjects', 'Auto-grading']
        },
        {
            id: 'quiz',
            name: 'Multiple Choice Quiz',
            description: 'Generate quizzes to test your knowledge on any VTU subject',
            category: 'Practice',
            icon: MessageSquare,
            color: 'bg-purple-600',
            features: ['Auto-grading', 'Timed tests', 'Instant feedback']
        },
        {
            id: 'math-solver',
            name: 'Math Problem Solver',
            description: 'Get step-by-step solutions to math problems with detailed explanations',
            category: 'Problem Solving',
            icon: Calculator,
            color: 'bg-green-600',
            features: ['Step-by-step solutions', 'Multiple methods', 'Visual graphs']
        },
        {
            id: 'flashcard',
            name: 'Flashcard Generator',
            description: 'Generate flashcards to help you memorize key concepts and formulas',
            category: 'Study',
            icon: Star,
            color: 'bg-pink-600',
            features: ['Spaced repetition', 'Custom decks', 'Progress tracking']
        },
        {
            id: 'study-guide',
            name: 'Study Guide Creator',
            description: 'Create comprehensive study guides for your upcoming VTU exams',
            category: 'Study',
            icon: BookOpen,
            color: 'bg-indigo-600',
            features: ['Topic organization', 'Key concepts', 'Practice questions']
        },
        {
            id: 'summarizer',
            name: 'Text Summarizer',
            description: 'Summarize long texts and documents into key points',
            category: 'Reading',
            icon: FileText,
            color: 'bg-orange-600',
            features: ['Bullet point summaries', 'Adjustable length', 'Key highlights']
        },
        {
            id: 'vocabulary',
            name: 'Vocabulary Builder',
            description: 'Learn new vocabulary words with definitions and examples',
            category: 'Language',
            icon: Languages,
            color: 'bg-teal-600',
            features: ['Word lists', 'Example sentences', 'Pronunciation']
        },
        {
            id: 'practice',
            name: 'Practice Problems',
            description: 'Generate practice problems for any subject to improve your skills',
            category: 'Practice',
            icon: Zap,
            color: 'bg-red-600',
            features: ['Adaptive difficulty', 'Instant feedback', 'Progress tracking']
        },
        {
            id: 'essay-outline',
            name: 'Essay Outline Generator',
            description: 'Create structured outlines for your essays and research papers',
            category: 'Writing',
            icon: PenTool,
            color: 'bg-purple-600',
            features: ['Thesis development', 'Argument structure', 'Citation help']
        },
        {
            id: 'concept-explainer',
            name: 'Concept Explainer',
            description: 'Get clear explanations of complex concepts in simple language',
            category: 'Learning',
            icon: Lightbulb,
            color: 'bg-cyan-600',
            features: ['Simple language', 'Visual aids', 'Examples']
        },
        {
            id: 'note-taker',
            name: 'Note Taker',
            description: 'Convert your thoughts and lectures into organized notes',
            category: 'Study',
            icon: BookOpen,
            color: 'bg-orange-500',
            features: ['Auto-formatting', 'Topic extraction', 'Quick search']
        },
        {
            id: 'grammar',
            name: 'Grammar Assistant',
            description: 'Check and improve your grammar and writing style',
            category: 'Writing',
            icon: PenTool,
            color: 'bg-green-600',
            features: ['Real-time checking', 'Style suggestions', 'Clarity tips']
        }
    ];

    const filters = ['All Tools', 'Practice', 'Problem Solving', 'Study', 'Reading', 'Language', 'Writing', 'Learning', 'Creative'];

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All Tools' || tool.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 animate-fade-in dark:bg-gray-900 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Tools</h1>
                <p className="text-gray-500 dark:text-gray-400">Powerful AI tools to enhance your learning and productivity</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tools..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeFilter === filter
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
                <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Star size={16} />
                    Favorites
                </button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTools.map(tool => (
                    <div
                        key={tool.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                <tool.icon size={24} />
                            </div>
                            <button className="text-gray-300 hover:text-yellow-500 transition-colors">
                                <Star size={20} />
                            </button>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{tool.description}</p>

                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                                {tool.category}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Features:</p>
                            {tool.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="text-green-500">✓</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center py-12">
                    <Sparkles size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tools found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Tools;
