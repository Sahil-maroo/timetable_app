import React, { useMemo, useState } from 'react';
import { CLASS_RANGES, SPECIAL_DATES } from '../constants';
import { EventType, CustomEvent } from '../types';
import Legend from './Legend';
import { usePlanner } from '../context/PlannerContext';

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDateKey = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const getDayType = (dateKey: string, dayOfWeek: number): EventType => {
  if (SPECIAL_DATES[dateKey]) {
    return SPECIAL_DATES[dateKey].type;
  }
  if (dayOfWeek === 0) {
    return EventType.SUNDAY;
  }
  const currentDate = new Date(dateKey);
  const isInClassRange = CLASS_RANGES.some(range => {
    const start = new Date(range.start);
    const end = new Date(range.end);
    return currentDate >= start && currentDate <= end;
  });
  if (isInClassRange) {
    return EventType.CLASSES;
  }
  return EventType.NONE;
};

// --- Modal Component (The Box to Add Notes/Events) ---
const DayDetailsModal = ({ dateKey, onClose }: { dateKey: string; onClose: () => void }) => {
  const { notes, addNote, deleteNote, customEvents, addCustomEvent, deleteCustomEvent } = usePlanner();
  const [activeTab, setActiveTab] = useState<'NOTE' | 'ASSIGNMENT' | 'EVENT'>('NOTE');
  
  // Inputs
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');

  const dayNotes = notes.filter(n => n.date === dateKey);
  const dayCustomEvents = customEvents.filter(e => e.date === dateKey);
  
  const dateObj = new Date(dateKey);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const specialEvent = SPECIAL_DATES[dateKey];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const id = Math.random().toString(36).substr(2, 9);
    
    if (activeTab === 'NOTE') {
      addNote({ id, date: dateKey, content, time: time || undefined });
    } else {
      addCustomEvent({
        id,
        date: dateKey,
        title: content,
        type: activeTab,
        time: time || undefined
      });
    }
    
    setContent('');
    setTime('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] flex flex-col transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white mb-1">{formattedDate}</h3>
        
        {specialEvent ? (
           <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit
             ${specialEvent.type === EventType.HOLIDAY ? 'bg-pink-500/20 text-pink-400' : ''}
             ${specialEvent.type === EventType.EXAM ? 'bg-yellow-500/20 text-yellow-400' : ''}
             ${specialEvent.type === EventType.COMMENCEMENT ? 'bg-blue-500/20 text-blue-400' : ''}
             ${specialEvent.type === EventType.RE_EXAM ? 'bg-orange-500/20 text-orange-400' : ''}
           `}>
             {specialEvent.label}
           </div>
        ) : (
           <div className="text-gray-500 text-sm mb-4">No academic events</div>
        )}

        {/* List of Items */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 mb-4 custom-scrollbar pr-2 bg-gray-950/30 p-2 rounded-lg border border-gray-800">
           {/* Assignments & Events */}
           {dayCustomEvents.length > 0 && (
             <div className="space-y-2">
               {dayCustomEvents.map(evt => (
                 <div key={evt.id} className={`p-2 rounded border flex justify-between items-center group
                    ${evt.type === 'ASSIGNMENT' ? 'bg-violet-500/10 border-violet-500/30' : 'bg-orange-500/10 border-orange-500/30'}
                 `}>
                    <div>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded 
                            ${evt.type === 'ASSIGNMENT' ? 'bg-violet-500/20 text-violet-300' : 'bg-orange-500/20 text-orange-300'}
                         `}>
                           {evt.type}
                         </span>
                         {evt.time && <span className="text-xs text-gray-400 font-mono">{evt.time}</span>}
                      </div>
                      <p className="text-sm text-gray-200 mt-1">{evt.title}</p>
                    </div>
                    <button onClick={() => deleteCustomEvent(evt.id)} className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                 </div>
               ))}
             </div>
           )}

           {/* Notes */}
           <div className="space-y-2">
             {dayNotes.map(note => (
                <div key={note.id} className="bg-gray-800 p-2 rounded border border-gray-700 flex justify-between items-start group">
                  <div className="flex-1">
                    {note.time && <span className="text-[10px] text-indigo-400 font-mono block mb-0.5">{note.time}</span>}
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
             ))}
             {dayNotes.length === 0 && dayCustomEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm italic">Nothing scheduled</p>
                </div>
             )}
           </div>
        </div>

        {/* Input Area (The Add Box) */}
        <div className="border-t border-gray-700 pt-4">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Add New Item</label>
          <div className="flex gap-2 mb-3 bg-gray-950 p-1 rounded-lg">
             <button onClick={() => setActiveTab('NOTE')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'NOTE' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>Note</button>
             <button onClick={() => setActiveTab('ASSIGNMENT')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'ASSIGNMENT' ? 'bg-violet-900/40 text-violet-300 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Assignment</button>
             <button onClick={() => setActiveTab('EVENT')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'EVENT' ? 'bg-orange-900/40 text-orange-300 shadow' : 'text-gray-500 hover:text-gray-300'}`}>Event</button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
               <input 
                 type="time" 
                 value={time}
                 onChange={(e) => setTime(e.target.value)}
                 className="bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none w-24 text-center"
               />
               <input 
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 placeholder={activeTab === 'NOTE' ? "Write a note..." : activeTab === 'ASSIGNMENT' ? "What's the assignment?" : "Event name?"}
                 className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
               />
            </div>
            <button type="submit" className={`
               w-full py-2 rounded text-sm font-bold transition-colors shadow-lg
               ${activeTab === 'NOTE' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20' : ''}
               ${activeTab === 'ASSIGNMENT' ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20' : ''}
               ${activeTab === 'EVENT' ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20' : ''}
            `}>
              Add {activeTab.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const MonthGrid: React.FC<{ year: number; monthIndex: number; onDayClick: (dateKey: string) => void }> = ({ year, monthIndex, onDayClick }) => {
  const { notes, customEvents } = usePlanner();
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstDay = getFirstDayOfMonth(year, monthIndex); // 0 (Sun) - 6 (Sat)
  
  // Real-time "Today" check
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const todayDate = today.getDate();

  const days = useMemo(() => {
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }, [year, monthIndex, daysInMonth, firstDay]);

  return (
    <div className="bg-gray-800 flex flex-col h-full">
      {/* Standard Layout: X-Axis = Weekdays */}
      <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-900/30 text-gray-500 font-bold text-[10px] text-center">
        <div className="p-2 text-red-400">SUN</div>
        <div className="p-2">MON</div>
        <div className="p-2">TUE</div>
        <div className="p-2">WED</div>
        <div className="p-2">THU</div>
        <div className="p-2">FRI</div>
        <div className="p-2">SAT</div>
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} className="border-b border-r border-gray-700/50 bg-gray-900/20"></div>;
          }

          const dateKey = formatDateKey(year, monthIndex, day);
          const dayOfWeek = new Date(year, monthIndex, day).getDay();
          const type = getDayType(dateKey, dayOfWeek);
          const dayNotes = notes.filter(n => n.date === dateKey);
          const dayEvents = customEvents.filter(e => e.date === dateKey);
          
          let bgClass = 'bg-gray-800';
          let textClass = 'text-gray-300';

          switch (type) {
            case EventType.HOLIDAY:
              bgClass = 'bg-pink-500/10 hover:bg-pink-500/20';
              textClass = 'text-pink-400 font-bold';
              break;
            case EventType.CLASSES:
              bgClass = 'bg-emerald-500/10 hover:bg-emerald-500/20';
              textClass = 'text-emerald-400 font-medium';
              break;
            case EventType.EXAM:
              bgClass = 'bg-yellow-500/10 hover:bg-yellow-500/20';
              textClass = 'text-yellow-400 font-bold';
              break;
            case EventType.COMMENCEMENT:
              bgClass = 'bg-blue-500/10 hover:bg-blue-500/20';
              textClass = 'text-blue-400 font-bold';
              break;
            case EventType.RE_EXAM:
              bgClass = 'bg-orange-500/10 hover:bg-orange-500/20';
              textClass = 'text-orange-400 font-bold';
              break;
            case EventType.SUNDAY:
              textClass = 'text-red-400/80 font-medium';
              bgClass = 'bg-gray-800/50 hover:bg-gray-800';
              break;
            default:
              bgClass = 'bg-gray-800 hover:bg-gray-700/50';
              break;
          }

          const isToday = isCurrentMonth && day === todayDate;
          const label = SPECIAL_DATES[dateKey]?.label;

          return (
            <div 
              key={day} 
              onClick={() => onDayClick(dateKey)}
              className={`
                relative p-1 border-b border-r border-gray-700/50 cursor-pointer
                ${bgClass} ${textClass} transition-colors
                flex flex-col justify-start items-start overflow-hidden group
                ${isToday ? 'ring-2 ring-inset ring-indigo-500 z-10' : ''}
              `}
            >
              <div className="flex justify-between w-full items-start">
                <span className={`text-xs font-medium ${isToday ? 'text-indigo-400 font-bold' : 'opacity-80'}`}>{day}</span>
                {/* Dots for Items */}
                <div className="flex gap-0.5">
                  {dayNotes.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>}
                  {dayEvents.map((evt, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${evt.type === 'ASSIGNMENT' ? 'bg-violet-500' : 'bg-orange-500'}`}></div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 w-full mt-0.5 overflow-hidden">
                {label && (
                   <div className="text-[8px] leading-tight px-1 py-0.5 rounded bg-gray-900/50 backdrop-blur-sm truncate w-full">
                     {label}
                   </div>
                )}
                {!label && dayEvents.length > 0 && (
                   <div className={`text-[8px] leading-tight px-1 py-0.5 rounded backdrop-blur-sm truncate w-full
                     ${dayEvents[0].type === 'ASSIGNMENT' ? 'bg-violet-500/20 text-violet-300' : 'bg-orange-500/20 text-orange-300'}
                   `}>
                     {dayEvents[0].title}
                   </div>
                )}
              </div>
              
              {/* Add Hint on Hover */}
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                 </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  // Sync with device time on load
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800 shadow-xl max-w-lg mx-auto">
        {/* Calendar Header Navigation */}
        <div className="flex items-center justify-between bg-gray-900/50 p-3 border-b border-gray-700">
          <button 
            onClick={goToPreviousMonth}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-white tracking-wide">{monthName}</h2>
            <button onClick={() => setCurrentDate(new Date())} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium">
              Jump to Today
            </button>
          </div>
          
          <button 
            onClick={goToNextMonth}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Calendar Body Box */}
        <div className="h-[400px] sm:h-[450px] w-full bg-gray-800">
          <MonthGrid 
            year={currentDate.getFullYear()} 
            monthIndex={currentDate.getMonth()} 
            onDayClick={(dateKey) => setSelectedDayKey(dateKey)}
          />
        </div>
      </div>

      <Legend />

      {selectedDayKey && (
        <DayDetailsModal 
          dateKey={selectedDayKey} 
          onClose={() => setSelectedDayKey(null)} 
        />
      )}
    </div>
  );
};

export default CalendarView;