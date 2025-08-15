import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BookOpen, FileText, Hash } from 'lucide-react';
import { Note, Tag } from './types/Note';
import { saveNotes, loadNotes, generateId } from './utils/storage';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import TagFilter from './components/TagFilter';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const tags = useMemo(() => {
    const tagCounts = notes.reduce((acc, note) => {
      note.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count, color: '' }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(selectedTag => note.tags.includes(selectedTag));

      return matchesSearch && matchesTags;
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [notes, searchQuery, selectedTags]);

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingNote) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: now }
            : note
        )
      );
    } else {
      const newNote: Note = {
        id: generateId(),
        ...noteData,
        createdAt: now,
        updatedAt: now,
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
    }
    
    setIsEditing(false);
    setEditingNote(undefined);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notes Keeper</h1>
                <p className="text-gray-600">Your personal note management system</p>
              </div>
            </div>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              New Note
            </button>
          </div>

          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notes by title, content, or tags..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-xl font-semibold text-gray-900">{notes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tags</p>
                <p className="text-xl font-semibold text-gray-900">{tags.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-xl font-semibold text-gray-900">{filteredNotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* Notes Grid */}
          <div className="lg:col-span-3">
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {notes.length === 0 ? 'No notes yet' : 'No matching notes found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {notes.length === 0 
                    ? 'Create your first note to get started with your personal knowledge base.'
                    : 'Try adjusting your search query or selected tags.'
                  }
                </p>
                {notes.length === 0 && (
                  <button
                    onClick={handleCreateNote}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Note
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Editor Modal */}
      {isEditing && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setIsEditing(false);
            setEditingNote(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;