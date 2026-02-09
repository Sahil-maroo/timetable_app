
export enum EventType {
  HOLIDAY = 'HOLIDAY',
  CLASSES = 'CLASSES',
  EXAM = 'EXAM',
  COMMENCEMENT = 'COMMENCEMENT',
  RE_EXAM = 'RE_EXAM',
  SUNDAY = 'SUNDAY',
  NONE = 'NONE'
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string; // Hex color
  faculty?: string;
}

export interface CourseSlot {
  id: string;
  subjectId: string; // Refers to Subject.id
  type: 'LECTURE' | 'LAB' | 'LUNCH' | 'EMPTY';
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
  duration: number; // in hours
  day: string;
}

export interface ExtraClass {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  type: 'LECTURE' | 'LAB' | 'LUNCH';
  startTime: string;
  endTime: string;
  duration: number;
}

export interface Note {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  time?: string; // Optional time e.g. "14:00"
}

export interface CustomEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'ASSIGNMENT' | 'EVENT';
  time?: string;
}

export interface DaySchedule {
  day: string;
  slots: CourseSlot[];
}

export interface Cancellation {
  id: string;
  date: string; // YYYY-MM-DD
  slotId: string;
}

export interface CalendarDay {
  date: Date;
  type: EventType;
  label?: string;
}

export interface MonthData {
  name: string;
  year: number;
  monthIndex: number; // 0-11
}
