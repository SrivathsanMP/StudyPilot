import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Note {
  id: string;
  gradeId: number;
  topic: string;
  content: string;
  type: 'lesson-plan' | 'question-paper' | 'explanation';
  timestamp: Date;
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  deleteNote: (id: string) => void;
  getNotesByGrade: (gradeId: number) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('studypilot_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: Note) => ({ ...n, timestamp: new Date(n.timestamp) }));
    }
    return [];
  });

  const saveToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('studypilot_notes', JSON.stringify(updatedNotes));
  };

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'timestamp'>) => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      timestamp: new Date(),
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const getNotesByGrade = useCallback(
    (gradeId: number) => {
      return notes.filter((n) => n.gradeId === gradeId);
    },
    [notes]
  );

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, getNotesByGrade }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
