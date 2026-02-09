import React, { useMemo } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { CourseSlot, ExtraClass } from '../types';

interface RenderSlot extends CourseSlot {
  isExtra?: boolean;
  isCancelled?: boolean;
}

const TimeSlotCell: React.FC<{ slot: RenderSlot }> = ({ slot }) => {
  const { getSubject } = usePlanner();
  const subject = getSubject(slot.subjectId);

  // If subject not found (deleted?), use fallback
  const subjectName = subject ? subject.code.toUpperCase() : 'UNKNOWN';
  const color = subject ? subject.color : '#6b7280'; // gray-500

  // Styles for cancelled/extra
  const opacity = slot.isCancelled ? 'opacity-50 grayscale' : 'opacity-100';
  const borderStyle = slot.isExtra ? 'border-indigo-500/50 border-l-4' : 'border-transparent';
  
  return (
    <div 
      className={`flex flex-col justify-center items-center p-1 text-center rounded-sm h-full w-full relative overflow-hidden group hover:z-10 hover:shadow-lg transition-all ${opacity} ${borderStyle}`}
      style={{ 
        backgroundColor: slot.isCancelled ? '#1f2937' : `${color}30`, // Translucent background
        border: `1px solid ${color}40`
      }}
    >
      <span className={`font-bold text-xs leading-tight break-words ${slot.isCancelled ? 'line-through text-gray-500' : 'text-gray-100'}`}>
        {subjectName}
      </span>
      
      <span className="text-[10px] text-gray-300 mt-0.5 font-medium uppercase tracking-tighter">
        {slot.type !== 'EMPTY' ? slot.type : ''}
      </span>

      {/* Hover Detail */}
      <span className="hidden group-hover:block absolute bottom-0.5 left-0 right-0 text-[8px] bg-black/60 text-white py-0.5 backdrop-blur-sm">
        {slot.startTime} - {slot.endTime}
      </span>
      
      {slot.isExtra && <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-bl"></span>}
      {slot.isCancelled && <span className="absolute top-1 right-1 text-[8px] text-red-400 font-bold bg-gray-900/90 px-1 rounded shadow-sm">CANCELLED</span>}
    </div>
  );
};

const TimetableView: React.FC = () => {
  const { timetable, cancellations, extraClasses } = usePlanner();
  
  // Get current week dates (Mon - Sun)
  const currentWeekDates = useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust so 1 (Mon) is first
    const monday = new Date(today.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push({
        dateObj: d,
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        shortName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate()
      });
    }
    return dates;
  }, []);

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // 8:00 to 18:00

  // Pre-calculate slots for the grid to handle merged cells easier
  const getSlotForCell = (dateStr: string, dayName: string, hour: number) => {
    const extra = extraClasses.find(e => e.date === dateStr && parseInt(e.startTime) === hour);
    if (extra) return { ...extra, day: dayName, isExtra: true };

    const recurring = timetable.find(s => s.day === dayName && parseInt(s.startTime.split(':')[0]) === hour);
    if (recurring) {
      const isCancelled = cancellations.some(c => c.date === dateStr && c.slotId === recurring.id);
      return { ...recurring, isCancelled };
    }
    
    return null;
  };

  // Check if a cell is covered by a previous slot (rowspan)
  const isCovered = (dateStr: string, dayName: string, hour: number) => {
    // Check previous hours for any slot that spans over this hour
    for (let h = 8; h < hour; h++) {
       const slot = getSlotForCell(dateStr, dayName, h);
       if (slot && (h + slot.duration > hour)) return true;
    }
    return false;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 flex flex-col h-[600px] overflow-hidden">
      
      <div className="p-3 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center flex-shrink-0">
         <h3 className="text-sm font-bold text-gray-300">Weekly Schedule</h3>
         <span className="text-xs text-gray-500">
           {currentWeekDates[0].shortName} {currentWeekDates[0].dayNum} - {currentWeekDates[6].shortName} {currentWeekDates[6].dayNum}
         </span>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-gray-900">
        <div className="min-w-[800px] inline-block w-full">
          {/* Header Row */}
          <div className="grid grid-cols-[50px_repeat(7,1fr)] sticky top-0 z-30">
            <div className="bg-gray-800 border-b border-r border-gray-700 p-2 text-[10px] font-mono text-gray-500 flex items-center justify-center sticky left-0 z-40">
              TIME
            </div>
            {currentWeekDates.map(d => (
              <div key={d.dayName} className={`border-b border-r border-gray-700/50 p-2 text-center bg-gray-800 ${d.dayName === currentDayName ? 'bg-indigo-900/20' : ''}`}>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{d.shortName}</div>
                <div className={`text-sm font-bold ${d.dayName === currentDayName ? 'text-indigo-400' : 'text-gray-300'}`}>{d.dayNum}</div>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="grid grid-cols-[50px_repeat(7,1fr)] auto-rows-[minmax(80px,auto)]">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Time Label Column - Sticky Left */}
                <div className="sticky left-0 z-20 bg-gray-800 border-r border-b border-gray-700 text-[10px] text-gray-500 font-mono flex items-start justify-center pt-2 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                  {String(hour).padStart(2, '0')}:00
                </div>

                {/* Days Columns for this Hour */}
                {currentWeekDates.map(d => {
                  if (isCovered(d.dateStr, d.dayName, hour)) return null;

                  const slot = getSlotForCell(d.dateStr, d.dayName, hour);

                  if (slot) {
                    return (
                      <div 
                        key={`${d.dateStr}-${hour}`}
                        className="p-1 border-r border-b border-gray-700/30 relative bg-gray-900/40"
                        style={{ gridRow: `span ${slot.duration}` }}
                      >
                        <TimeSlotCell slot={slot} />
                      </div>
                    );
                  }

                  return (
                    <div key={`${d.dateStr}-${hour}`} className="border-r border-b border-gray-700/30"></div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableView;