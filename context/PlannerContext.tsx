import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, CourseSlot, Cancellation, ExtraClass, Note, CustomEvent } from '../types';
import { INITIAL_SUBJECTS, INITIAL_TIMETABLE } from '../constants';

interface PlannerContextType {
  subjects: Subject[];
  timetable: CourseSlot[];
  cancellations: Cancellation[];
  extraClasses: ExtraClass[];
  notes: Note[];
  customEvents: CustomEvent[];
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addSlot: (slot: CourseSlot) => void;
  removeSlot: (id: string) => void;
  cancelClass: (date: string, slotId: string) => void;
  restoreClass: (date: string, slotId: string) => void;
  addExtraClass: (extra: ExtraClass) => void;
  removeExtraClass: (id: string) => void;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addCustomEvent: (event: CustomEvent) => void;
  deleteCustomEvent: (id: string) => void;
  getSubject: (id: string) => Subject | undefined;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

// Helper for localStorage persistence
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useStickyState<Subject[]>(INITIAL_SUBJECTS, 'planner_subjects');
  const [timetable, setTimetable] = useStickyState<CourseSlot[]>(INITIAL_TIMETABLE, 'planner_timetable');
  const [cancellations, setCancellations] = useStickyState<Cancellation[]>([], 'planner_cancellations');
  const [extraClasses, setExtraClasses] = useStickyState<ExtraClass[]>([], 'planner_extraclasses');
  const [notes, setNotes] = useStickyState<Note[]>([], 'planner_notes');
  const [customEvents, setCustomEvents] = useStickyState<CustomEvent[]>([], 'planner_custom_events');

  const addSubject = (subject: Subject) => setSubjects(prev => [...prev, subject]);
  
  const updateSubject = (subject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === subject.id ? subject : s));
  };
  
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTimetable(prev => prev.filter(slot => slot.subjectId !== id));
    setExtraClasses(prev => prev.filter(e => e.subjectId !== id));
  };

  const addSlot = (slot: CourseSlot) => setTimetable(prev => [...prev, slot]);
  
  const removeSlot = (id: string) => setTimetable(prev => prev.filter(slot => slot.id !== id));
  
  const cancelClass = (date: string, slotId: string) => {
    setCancellations(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), date, slotId }]);
  };

  const restoreClass = (date: string, slotId: string) => {
    setCancellations(prev => prev.filter(c => !(c.date === date && c.slotId === slotId)));
  };

  const addExtraClass = (extra: ExtraClass) => setExtraClasses(prev => [...prev, extra]);

  const removeExtraClass = (id: string) => setExtraClasses(prev => prev.filter(e => e.id !== id));

  const addNote = (note: Note) => setNotes(prev => [...prev, note]);

  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const addCustomEvent = (event: CustomEvent) => setCustomEvents(prev => [...prev, event]);

  const deleteCustomEvent = (id: string) => setCustomEvents(prev => prev.filter(e => e.id !== id));

  const getSubject = (id: string) => subjects.find(s => s.id === id || s.code === id);

  return (
    <PlannerContext.Provider value={{
      subjects,
      timetable,
      cancellations,
      extraClasses,
      notes,
      customEvents,
      addSubject,
      updateSubject,
      deleteSubject,
      addSlot,
      removeSlot,
      cancelClass,
      restoreClass,
      addExtraClass,
      removeExtraClass,
      addNote,
      deleteNote,
      addCustomEvent,
      deleteCustomEvent,
      getSubject
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
  return context;
};