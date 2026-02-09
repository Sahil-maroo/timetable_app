import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Subject, CourseSlot, ExtraClass } from '../types';

const SubjectItem: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { updateSubject, deleteSubject } = usePlanner();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [color, setColor] = useState(subject.color);

  const handleSave = () => {
    updateSubject({ ...subject, name, color });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg group hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <input 
          type="color" 
          value={color}
          onChange={(e) => {
             setColor(e.target.value);
             // Auto save color change for better UX
             updateSubject({ ...subject, color: e.target.value });
          }}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
          title="Change Subject Color"
        />
        {isEditing ? (
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white flex-1"
          />
        ) : (
          <div className="flex flex-col">
            {/* Force Uppercase Display */}
            <span className="font-bold text-gray-200">{subject.code.toUpperCase()}</span>
            <span className="text-xs text-gray-400">{subject.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {isEditing ? (
          <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium px-2">Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium px-2">Edit</button>
        )}
        <button onClick={() => deleteSubject(subject.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

const AddClassForm = () => {
  const { subjects, addSlot } = usePlanner();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('08:00');
  const [duration, setDuration] = useState(1);
  const [type, setType] = useState<CourseSlot['type']>('LECTURE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = startHour + duration;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    addSlot({
      id: Math.random().toString(36).substr(2, 9),
      subjectId,
      day,
      startTime,
      endTime,
      duration,
      type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Subject</label>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-white">
            {subjects.map(s => <option key={s.id} value={s.id}>{s.code.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-400 mb-1">Day</label>
           <select value={day} onChange={e => setDay(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-white">
             {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-400 mb-1">Start Time</label>
           <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-white">
             {[8,9,10,11,12,13,14,15,16,17,18,19,20].map(h => <option key={h} value={`${String(h).padStart(2, '0')}:00`}>{h}:00</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-400 mb-1">Duration (Hrs)</label>
           <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-white">
             {[1,2,3,4].map(h => <option key={h} value={h}>{h} hr</option>)}
           </select>
        </div>
        <div className="col-span-2">
           <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
           <div className="flex gap-4">
             {['LECTURE', 'LAB', 'LUNCH'].map(t => (
               <label key={t} className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="type" value={t} checked={type === t} onChange={(e) => setType(e.target.value as any)} className="text-indigo-500 bg-gray-900 border-gray-700 focus:ring-indigo-500" />
                 <span className="text-sm text-gray-300">{t}</span>
               </label>
             ))}
           </div>
        </div>
      </div>
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
        Assign Class
      </button>
    </form>
  );
};

interface RescheduleTarget {
  slot: CourseSlot | ExtraClass;
  date: string;
  isExtra: boolean;
}

const RescheduleModal: React.FC<{ 
  target: RescheduleTarget | null; 
  onClose: () => void; 
}> = ({ target, onClose }) => {
  const { subjects, addExtraClass, cancelClass, removeExtraClass, addSlot, removeSlot } = usePlanner();
  
  // Form State
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [duration, setDuration] = useState(1);
  const [type, setType] = useState<'LECTURE' | 'LAB' | 'LUNCH'>('LECTURE');
  const [updateRecurring, setUpdateRecurring] = useState(false);

  // Initialize form when target changes
  React.useEffect(() => {
    if (target) {
      setNewDate(target.date);
      setNewTime(target.slot.startTime);
      setDuration(target.slot.duration);
      // @ts-ignore - assuming type matches
      setType(target.slot.type);
      setUpdateRecurring(false);
    }
  }, [target]);

  if (!target) return null;

  const subject = subjects.find(s => s.id === target.slot.subjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startHour = parseInt(newTime.split(':')[0]);
    const endHour = startHour + duration;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    if (updateRecurring && !target.isExtra) {
      // 1. Remove old recurring slot
      removeSlot(target.slot.id);
      
      // 2. Add new recurring slot
      const newDay = new Date(newDate).toLocaleDateString('en-US', { weekday: 'long' });
      addSlot({
        id: Math.random().toString(36).substr(2, 9),
        subjectId: target.slot.subjectId,
        day: newDay,
        startTime: newTime,
        endTime: endTime,
        duration,
        type: type as any
      });
    } else {
      // Instance Reschedule
      // 1. Cancel/Remove original
      if (target.isExtra) {
        removeExtraClass(target.slot.id);
      } else {
        cancelClass(target.date, target.slot.id);
      }

      // 2. Add new Extra Class
      addExtraClass({
        id: Math.random().toString(36).substr(2, 9),
        date: newDate,
        subjectId: target.slot.subjectId,
        startTime: newTime,
        endTime: endTime,
        duration,
        type: type as any
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Reschedule Class</h3>
        <p className="text-sm text-gray-400 mb-6">
          Rescheduling <strong className="text-indigo-400">{subject?.code.toUpperCase()}</strong> from <span className="text-gray-300">{target.date} at {target.slot.startTime}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">New Date</label>
            <input 
              type="date" 
              required
              value={newDate} 
              onChange={e => setNewDate(e.target.value)} 
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">New Start Time</label>
              <select value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-white">
                {[8,9,10,11,12,13,14,15,16,17,18,19,20].map(h => <option key={h} value={`${String(h).padStart(2, '0')}:00`}>{h}:00</option>)}
              </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
               <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-white">
                 {[1,2,3,4].map(h => <option key={h} value={h}>{h} hr</option>)}
               </select>
            </div>
          </div>
          
          <div>
             <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
             <div className="flex gap-4">
               {['LECTURE', 'LAB', 'LUNCH'].map(t => (
                 <label key={t} className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" name="reschedType" value={t} checked={type === t} onChange={(e) => setType(e.target.value as any)} className="text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-500" />
                   <span className="text-sm text-gray-300">{t}</span>
                 </label>
               ))}
             </div>
          </div>

          {!target.isExtra && (
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="updateRecurring"
                checked={updateRecurring}
                onChange={e => setUpdateRecurring(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500" 
              />
              <label htmlFor="updateRecurring" className="text-xs text-gray-300">
                Update for all future weeks? (Changes timetable)
              </label>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-lg shadow-indigo-600/20">
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper to generate next 7 days of classes
const UpcomingClasses = () => {
   const { timetable, subjects, cancelClass, cancellations, restoreClass, extraClasses, removeExtraClass } = usePlanner();
   const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget | null>(null);
   
   const today = new Date(); // In real app, might want to sync with constant date
   
   // Simple logic: iterate next 7 days, find matches in timetable AND extra classes
   const upcoming = [];
   for (let i = 0; i < 7; i++) {
     const date = new Date();
     date.setDate(today.getDate() + i);
     const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
     const dateStr = date.toISOString().split('T')[0];

     // 1. Recurring Slots
     const slots = timetable.filter(s => s.day === dayName);
     for (const slot of slots) {
        if (slot.type === 'EMPTY' || slot.type === 'LUNCH') continue;
        const isCancelled = cancellations.some(c => c.date === dateStr && c.slotId === slot.id);
        upcoming.push({ 
          date: dateStr, 
          slot, 
          isCancelled, 
          isExtra: false,
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
          sortTime: parseInt(slot.startTime.replace(':', '')) 
        });
     }

     // 2. Extra Classes
     const extras = extraClasses.filter(e => e.date === dateStr);
     for (const extra of extras) {
       upcoming.push({
         date: dateStr,
         slot: extra,
         isCancelled: false, // Extra classes are either present or deleted
         isExtra: true,
         displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
         sortTime: parseInt(extra.startTime.replace(':', ''))
       });
     }
   }

   // Sort by Date then Time
   upcoming.sort((a, b) => {
     if (a.date !== b.date) return a.date.localeCompare(b.date);
     return a.sortTime - b.sortTime;
   });

   if (upcoming.length === 0) return <div className="text-gray-500 text-sm text-center py-4">No upcoming classes this week.</div>;

   return (
     <>
       <div className="space-y-2 mt-2">
         {upcoming.map((item, idx) => {
           const subject = subjects.find(s => s.id === item.slot.subjectId);
           return (
             <div key={idx} className={`flex items-center justify-between p-3 rounded-md border ${item.isCancelled ? 'bg-gray-900/30 border-gray-800 opacity-60' : 'bg-gray-800 border-gray-700'}`}>
               <div className="flex-1">
                 <div className="flex items-center gap-2">
                   {/* Force Uppercase */}
                   <span className={`text-sm font-bold ${item.isCancelled ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {subject?.code.toUpperCase()} <span className="text-xs font-normal opacity-70">({item.slot.type})</span>
                   </span>
                   {item.isCancelled && <span className="text-[10px] bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">Cancelled</span>}
                   {item.isExtra && <span className="text-[10px] bg-indigo-900/30 text-indigo-400 px-1.5 py-0.5 rounded">Rescheduled</span>}
                 </div>
                 <div className="text-xs text-gray-400 mt-1">
                   {item.displayDate} • {item.slot.startTime}
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 {!item.isCancelled && (
                   <button 
                     onClick={() => setRescheduleTarget({ slot: item.slot, date: item.date, isExtra: item.isExtra })} 
                     className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                   >
                     Reschedule
                   </button>
                 )}
                 {item.isCancelled ? (
                   <button onClick={() => restoreClass(item.date, item.slot.id)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-1">Restore</button>
                 ) : (
                   <button 
                      onClick={() => item.isExtra ? removeExtraClass(item.slot.id) : cancelClass(item.date, item.slot.id)} 
                      className="text-xs text-red-400 hover:text-red-300 font-medium px-1"
                   >
                     Cancel
                   </button>
                 )}
               </div>
             </div>
           )
         })}
       </div>
       
       <RescheduleModal 
         target={rescheduleTarget} 
         onClose={() => setRescheduleTarget(null)} 
       />
     </>
   );
};

const ClassManager: React.FC = () => {
  const { subjects, addSubject, timetable, removeSlot, getSubject } = usePlanner();
  const [newSubCode, setNewSubCode] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode) return;
    addSubject({
      id: newSubCode.toUpperCase(),
      code: newSubCode.toUpperCase(), // Ensure uppercase code on creation
      name: 'New Subject',
      color: '#94a3b8'
    });
    setNewSubCode('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Subject Management */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
           <h3 className="text-lg font-bold text-white mb-4">Subjects & Colors</h3>
           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {subjects.map(s => <SubjectItem key={s.id} subject={s} />)}
           </div>
           <form onSubmit={handleAddSubject} className="mt-4 flex gap-2 pt-4 border-t border-gray-700">
             <input 
               placeholder="New Subject Code..." 
               value={newSubCode}
               onChange={e => setNewSubCode(e.target.value)}
               className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
             />
             <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm">Add</button>
           </form>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
           <h3 className="text-lg font-bold text-white mb-4">Assign Class</h3>
           <AddClassForm />
        </div>
      </div>

      {/* Schedule Management */}
      <div className="lg:col-span-2 space-y-6">
         {/* Current Schedule List */}
         <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white">Weekly Schedule</h3>
             <span className="text-xs text-gray-400">{timetable.length} classes / week</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             {timetable.map(slot => {
               const subject = getSubject(slot.subjectId);
               return (
                 <div key={slot.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded border border-gray-700/50">
                   <div>
                     <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider block mb-1">{slot.day}</span>
                     <div className="text-gray-200 font-semibold text-sm">
                       {/* Force Uppercase */}
                       {subject?.code.toUpperCase() || slot.subjectId} <span className="text-gray-500 font-normal">({slot.startTime} - {slot.endTime})</span>
                     </div>
                   </div>
                   <button onClick={() => removeSlot(slot.id)} className="text-gray-500 hover:text-red-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                   </button>
                 </div>
               )
             })}
           </div>
         </div>

         {/* Exceptions / Upcoming */}
         <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-2">Upcoming Classes & Rescheduling</h3>
            <p className="text-xs text-gray-400 mb-4">Manage individual class instances for the next 7 days.</p>
            <UpcomingClasses />
         </div>
      </div>
    </div>
  );
};

export default ClassManager;