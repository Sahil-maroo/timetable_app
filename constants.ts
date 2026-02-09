import { EventType, Subject, CourseSlot } from './types';

// Helper to parse "YYYY-MM-DD"
const d = (str: string) => new Date(str);

export const SEMESTER_START = d('2026-01-01');
export const SEMESTER_END = d('2026-07-31');

export const SPECIAL_DATES: Record<string, { type: EventType; label?: string }> = {
  '2026-01-07': { type: EventType.COMMENCEMENT, label: 'Classes Begin' },
  '2026-01-26': { type: EventType.HOLIDAY, label: 'Republic Day' },
  '2026-02-23': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-02-24': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-02-25': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-02-26': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-02-27': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-02-28': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-03-02': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-03-03': { type: EventType.EXAM, label: 'Mid Sem' },
  '2026-03-04': { type: EventType.HOLIDAY, label: 'Holi' },
  '2026-03-19': { type: EventType.HOLIDAY, label: 'Gudi Padava' },
  '2026-03-21': { type: EventType.HOLIDAY, label: 'Id-ul-Fitr' },
  '2026-03-26': { type: EventType.HOLIDAY, label: 'Ram Navami' },
  '2026-03-31': { type: EventType.HOLIDAY, label: 'Mahavir Jayanti' },
  '2026-04-03': { type: EventType.HOLIDAY, label: 'Good Friday' },
  '2026-04-14': { type: EventType.HOLIDAY, label: 'Ambedkar Jayanti' }, 
  '2026-04-27': { type: EventType.EXAM, label: 'End Sem' },
  '2026-04-28': { type: EventType.EXAM, label: 'End Sem' },
  '2026-04-29': { type: EventType.EXAM, label: 'End Sem' },
  '2026-04-30': { type: EventType.EXAM, label: 'End Sem' },
  '2026-05-01': { type: EventType.HOLIDAY, label: 'Maharashtra Day' },
  '2026-05-02': { type: EventType.EXAM, label: 'End Sem' },
  '2026-05-04': { type: EventType.EXAM, label: 'End Sem' },
  '2026-05-05': { type: EventType.EXAM, label: 'End Sem' },
  '2026-05-06': { type: EventType.EXAM, label: 'End Sem' },
  '2026-05-20': { type: EventType.RE_EXAM, label: 'Re-Exam' },
  '2026-05-21': { type: EventType.RE_EXAM, label: 'Re-Exam' },
  '2026-05-22': { type: EventType.RE_EXAM, label: 'Re-Exam' },
  '2026-05-23': { type: EventType.RE_EXAM, label: 'Re-Exam' },
  '2026-05-27': { type: EventType.HOLIDAY, label: 'Id-ul-Zuha' },
  '2026-06-26': { type: EventType.HOLIDAY, label: 'Muharram' },
};

export const CLASS_RANGES = [
  { start: '2026-01-08', end: '2026-02-21' },
  { start: '2026-03-04', end: '2026-04-24' },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'FEM', code: 'FEM', name: 'Finite Element Method', color: '#10b981' }, // emerald-500
  { id: 'HM', code: 'HM', name: 'Heat Transfer', color: '#3b82f6' }, // blue-500
  { id: 'DE', code: 'DE', name: 'Design Engineering', color: '#8b5cf6' }, // violet-500
  { id: 'PM', code: 'PM', name: 'Production Management', color: '#f59e0b' }, // amber-500
  { id: 'CM', code: 'CM', name: 'Computational Methods', color: '#ec4899' }, // pink-500
  { id: 'TP', code: 'TP', name: 'Thermal Power', color: '#06b6d4' }, // cyan-500
  { id: 'TTHT', code: 'TTHT', name: 'Thermal Turbo', color: '#ef4444' }, // red-500
  { id: 'LUNCH', code: 'LUNCH', name: 'Lunch Break', color: '#64748b' }, // slate-500
];

// Helper to generate IDs
const uid = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_TIMETABLE: CourseSlot[] = [
  // Monday
  { id: uid(), day: 'Monday', subjectId: 'FEM', type: 'LECTURE', startTime: '08:00', endTime: '09:00', duration: 1 },
  { id: uid(), day: 'Monday', subjectId: 'HM', type: 'LECTURE', startTime: '10:00', endTime: '11:00', duration: 1 },
  { id: uid(), day: 'Monday', subjectId: 'DE', type: 'LECTURE', startTime: '11:00', endTime: '12:00', duration: 1 },
  { id: uid(), day: 'Monday', subjectId: 'PM', type: 'LECTURE', startTime: '12:00', endTime: '13:00', duration: 1 },
  { id: uid(), day: 'Monday', subjectId: 'LUNCH', type: 'LUNCH', startTime: '13:00', endTime: '14:00', duration: 1 },
  { id: uid(), day: 'Monday', subjectId: 'TTHT', type: 'LAB', startTime: '14:00', endTime: '16:00', duration: 2 },
  { id: uid(), day: 'Monday', subjectId: 'TP', type: 'LAB', startTime: '16:00', endTime: '18:00', duration: 2 },
  
  // Tuesday
  { id: uid(), day: 'Tuesday', subjectId: 'FEM', type: 'LECTURE', startTime: '09:00', endTime: '10:00', duration: 1 },
  { id: uid(), day: 'Tuesday', subjectId: 'CM', type: 'LECTURE', startTime: '10:00', endTime: '11:00', duration: 1 },
  { id: uid(), day: 'Tuesday', subjectId: 'TP', type: 'LECTURE', startTime: '11:00', endTime: '12:00', duration: 1 },
  { id: uid(), day: 'Tuesday', subjectId: 'TTHT', type: 'LECTURE', startTime: '12:00', endTime: '13:00', duration: 1 },
  { id: uid(), day: 'Tuesday', subjectId: 'LUNCH', type: 'LUNCH', startTime: '13:00', endTime: '14:00', duration: 1 },

  // Wednesday
  { id: uid(), day: 'Wednesday', subjectId: 'CM', type: 'LECTURE', startTime: '08:00', endTime: '09:00', duration: 1 },
  { id: uid(), day: 'Wednesday', subjectId: 'HM', type: 'LECTURE', startTime: '10:00', endTime: '11:00', duration: 1 },
  { id: uid(), day: 'Wednesday', subjectId: 'TP', type: 'LECTURE', startTime: '11:00', endTime: '12:00', duration: 1 },
  { id: uid(), day: 'Wednesday', subjectId: 'TTHT', type: 'LECTURE', startTime: '12:00', endTime: '13:00', duration: 1 },
  { id: uid(), day: 'Wednesday', subjectId: 'LUNCH', type: 'LUNCH', startTime: '13:00', endTime: '14:00', duration: 1 },

  // Thursday
  { id: uid(), day: 'Thursday', subjectId: 'HM', type: 'LECTURE', startTime: '08:00', endTime: '09:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'PM', type: 'LECTURE', startTime: '09:00', endTime: '10:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'DE', type: 'LECTURE', startTime: '10:00', endTime: '11:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'FEM', type: 'LECTURE', startTime: '11:00', endTime: '12:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'CM', type: 'LECTURE', startTime: '12:00', endTime: '13:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'LUNCH', type: 'LUNCH', startTime: '13:00', endTime: '14:00', duration: 1 },
  { id: uid(), day: 'Thursday', subjectId: 'PM', type: 'LAB', startTime: '14:00', endTime: '16:00', duration: 2 },

  // Friday
  { id: uid(), day: 'Friday', subjectId: 'PM', type: 'LECTURE', startTime: '09:00', endTime: '10:00', duration: 1 },
  { id: uid(), day: 'Friday', subjectId: 'DE', type: 'LECTURE', startTime: '10:00', endTime: '11:00', duration: 1 },
  { id: uid(), day: 'Friday', subjectId: 'TTHT', type: 'LECTURE', startTime: '11:00', endTime: '12:00', duration: 1 },
  { id: uid(), day: 'Friday', subjectId: 'TP', type: 'LECTURE', startTime: '12:00', endTime: '13:00', duration: 1 },
  { id: uid(), day: 'Friday', subjectId: 'LUNCH', type: 'LUNCH', startTime: '13:00', endTime: '14:00', duration: 1 },
  { id: uid(), day: 'Friday', subjectId: 'CM', type: 'LECTURE', startTime: '16:00', endTime: '17:00', duration: 1 },
];