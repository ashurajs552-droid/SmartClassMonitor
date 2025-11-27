import React, { useState, useEffect } from 'react';
import {
    Plus, Search, MoreVertical, Bold, Italic, Underline,
    List, AlignLeft, Link, Image, Save, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const { data } = await supabase.from('notes').select('*').order('updated_at', { ascending: false });
            if (data) {
                setNotes(data);
                if (data.length > 0 && !activeNote) setActiveNote(data[0]);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const createNewNote = () => {
        const newNote = {
            id: 'temp-' + Date.now(),
            title: 'Untitled Note',
            content: '',
            subject: 'General',
            updated_at: new Date().toISOString(),
            tags: []
        };
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden m-4 animate-fade-in">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white">My Notes</h2>
                        <button onClick={createNewNote} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredNotes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNote(note)}
                            className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${activeNote?.id === note.id
                                ? 'bg-white dark:bg-gray-800 border-l-4 border-l-indigo-600 shadow-sm'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-l-transparent'
                                }`}
                        >
                            <h4 className={`font-medium mb-1 ${activeNote?.id === note.id ? 'text-indigo-900 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                                {note.title || 'Untitled Note'}
                            </h4>
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>{note.subject || 'No Subject'}</span>
                                <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            {activeNote ? (
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
                    {/* Toolbar */}
                    <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Bold size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Italic size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Underline size={18} /></button>
                            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><List size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><AlignLeft size={18} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Last saved just now</span>
                            <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={18} /></button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                                <Save size={16} /> Save
                            </button>
                        </div>
                    </div>

                    {/* Metadata Inputs */}
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                            <input
                                type="text"
                                value={activeNote.subject}
                                onChange={(e) => setActiveNote({ ...activeNote, subject: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none py-1 text-sm font-medium dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</label>
                            <input
                                type="text"
                                placeholder="Add tags..."
                                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none py-1 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <input
                            type="text"
                            value={activeNote.title}
                            onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                            className="text-3xl font-bold text-gray-900 dark:text-white w-full border-none focus:outline-none mb-6 placeholder-gray-300 bg-transparent"
                            placeholder="Untitled Note"
                        />
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                            className="w-full h-full resize-none border-none focus:outline-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg placeholder-gray-300 bg-transparent"
                            placeholder="Start typing your notes here..."
                        />
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 text-center">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Note Selected</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                        Select a note from the sidebar to view its contents, or create a new note to start writing.
                    </p>
                    <button
                        onClick={createNewNote}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create New Note
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notes;
