import React, { useEffect, useState, useRef } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Subject } from '../types';

const TodayView: React.FC = () => {
  const { timetable, extraClasses, cancellations, getSubject } = usePlanner();
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Format today's date
  const todayDateStr = currentTime.toISOString().split('T')[0];
  const todayDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  // Get effective slots for today
  const todaysSlots = React.useMemo(() => {
    // 1. Recurring slots for this weekday, excluding cancellations
    const recurring = timetable
      .filter(s => s.day === todayDayName)
      .filter(s => !cancellations.some(c => c.date === todayDateStr && c.slotId === s.id))
      .map(s => ({ ...s, isExtra: false }));

    // 2. Extra classes for this specific date
    const extras = extraClasses
      .filter(e => e.date === todayDateStr)
      .map(e => ({ ...e, day: todayDayName, isExtra: true }));

    // 3. Combine and Sort
    return [...recurring, ...extras].sort((a, b) => {
       return parseInt(a.startTime.replace(':', '')) - parseInt(b.startTime.replace(':', ''));
    });
  }, [timetable, extraClasses, cancellations, todayDayName, todayDateStr]);

  // Determine current status
  const getCurrentStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(now);
    const [startH, startM] = startTime.split(':').map(Number);
    start.setHours(startH, startM, 0);

    const end = new Date(now);
    const [endH, endM] = endTime.split(':').map(Number);
    end.setHours(endH, endM, 0);

    if (now >= start && now < end) return 'ONGOING';
    if (now < start) return 'UPCOMING';
    return 'COMPLETED';
  };

  // Auto-scroll to first ongoing or upcoming event
  useEffect(() => {
    if (scrollRef.current) {
       scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [todaysSlots]);

  let foundActive = false;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-gray-900 rounded-xl p-6 border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p className="text-indigo-200 mt-1 font-medium">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
             <p className="text-sm text-indigo-300">Events Today</p>
             <p className="text-2xl font-bold text-white">{todaysSlots.length}</p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/10 transform skew-x-12"></div>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-gray-800 ml-4 md:ml-6 space-y-8 pb-4">
        {todaysSlots.length === 0 ? (
          <div className="pl-6 pt-2">
            <p className="text-gray-500 italic">No classes scheduled for today. Enjoy your day!</p>
          </div>
        ) : (
          todaysSlots.map((slot, idx) => {
            const subject = getSubject(slot.subjectId);
            const status = getCurrentStatus(slot.startTime, slot.endTime);
            const isRef = !foundActive && (status === 'ONGOING' || status === 'UPCOMING');
            if (isRef) foundActive = true;

            const isActive = status === 'ONGOING';
            const isPast = status === 'COMPLETED';

            return (
              <div 
                key={`${slot.id}-${idx}`} 
                ref={isRef ? scrollRef : null}
                className={`pl-6 relative group transition-all duration-300 ${isActive ? 'scale-105 origin-left' : ''}`}
              >
                {/* Timeline Dot */}
                <div className={`
                  absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                  ${isActive ? 'bg-indigo-500 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 
                    isPast ? 'bg-gray-800 border-gray-600' : 'bg-gray-900 border-gray-500'}
                `}></div>

                {/* Card */}
                <div className={`
                  rounded-lg p-4 border transition-colors
                  ${isActive ? 'bg-gray-800 border-indigo-500/50 shadow-md' : 
                    isPast ? 'bg-gray-900/50 border-gray-800 opacity-60' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}
                `}>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                         <span className={`text-sm font-mono ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                           {slot.startTime} - {slot.endTime}
                         </span>
                         {isActive && (
                           <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded animate-pulse">NOW</span>
                         )}
                         {slot.isExtra && (
                           <span className="text-[10px] font-bold bg-amber-600/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-600/30">RESCHEDULED</span>
                         )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-900 border border-gray-700 ${slot.type === 'LAB' ? 'text-pink-400' : 'text-emerald-400'}`}>
                          {slot.type}
                        </span>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="w-1 self-stretch rounded bg-gray-700" style={{ backgroundColor: subject?.color }}></div>
                      <div>
                        <h3 className={`text-lg font-bold ${isPast ? 'text-gray-400' : 'text-white'}`}>
                           {subject?.code.toUpperCase() || slot.subjectId}
                        </h3>
                        <p className="text-sm text-gray-400">{subject?.name}</p>
                      </div>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayView;