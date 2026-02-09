import React, { useRef, useEffect } from 'react';
import { SPECIAL_DATES } from '../constants';
import { EventType } from '../types';

const getAllEvents = () => {
  // Use actual current date to filter
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = Object.entries(SPECIAL_DATES)
    .map(([dateStr, data]) => ({
      date: new Date(dateStr),
      dateStr,
      ...data
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return { events, today };
};

const InfoPanel: React.FC = () => {
  const { events, today } = getAllEvents();
  const nextEventRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the next upcoming event if needed
  useEffect(() => {
    if (nextEventRef.current) {
      nextEventRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 h-[calc(100vh-4rem)] sticky top-0 flex flex-col">
      <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Key Dates
      </h3>
      
      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {events.map((event, idx) => {
          const isPast = event.date < today;
          const isNext = event.date >= today && (idx === 0 || events[idx-1].date < today);
          
          return (
            <div 
              key={idx} 
              ref={isNext ? nextEventRef : null}
              className={`flex gap-3 items-start group ${isPast ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className={`
                w-2 h-2 mt-2 rounded-full flex-shrink-0
                ${event.type === EventType.HOLIDAY ? 'bg-pink-500' : ''}
                ${event.type === EventType.EXAM ? 'bg-yellow-500' : ''}
                ${event.type === EventType.RE_EXAM ? 'bg-orange-500' : ''}
                ${event.type === EventType.COMMENCEMENT ? 'bg-blue-500' : ''}
              `}></div>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isNext ? 'text-indigo-400 font-bold' : 'text-gray-300 group-hover:text-indigo-300'}`}>
                  {event.label}
                  {isNext && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">NEXT</span>}
                </p>
                <p className="text-xs text-gray-500">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-bold text-gray-300 mb-3 text-transform uppercase tracking-wider">Quick Legend</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded"></div>Classes</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded"></div>Exams</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-500 rounded"></div>Holiday</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded"></div>Labs</div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;