import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import TimetableView from './components/TimetableView';
import InfoPanel from './components/InfoPanel';
import ClassManager from './components/ClassManager';
import TodayView from './components/TodayView';

function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'timetable' | 'manager'>('today');

  const getTabClass = (tab: string) => `
    flex flex-col md:flex-row items-center md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 w-full
    ${activeTab === tab 
      ? 'text-indigo-400 md:bg-indigo-600 md:text-white md:shadow-lg md:shadow-indigo-600/20' 
      : 'text-gray-500 hover:text-gray-300 md:text-gray-400 md:hover:bg-gray-800 md:hover:text-gray-100'}
  `;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30 flex items-center justify-between flex-shrink-0">
         <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-lg">VNIT Planner</span>
         </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="
        fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 p-2 flex justify-around
        md:relative md:border-t-0 md:border-r md:w-64 md:flex-col md:justify-start md:p-6 md:h-screen md:flex-shrink-0
      ">
        {/* Desktop Logo Area */}
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
           <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight text-white">VNIT Planner</h1>
             <p className="text-xs text-gray-500 font-medium">Summer 2026</p>
           </div>
        </div>

        {/* Navigation Links */}
        <div className="flex w-full md:flex-col gap-1 md:gap-2">
          <button onClick={() => setActiveTab('today')} className={getTabClass('today')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Today</span>
          </button>
          
          <button onClick={() => setActiveTab('calendar')} className={getTabClass('calendar')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Calendar</span>
          </button>

          <button onClick={() => setActiveTab('timetable')} className={getTabClass('timetable')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Timetable</span>
          </button>

          <button onClick={() => setActiveTab('manager')} className={getTabClass('manager')}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Manage</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 pb-24 md:p-8 md:pb-8 overflow-y-auto h-screen custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <div className="flex flex-col xl:flex-row gap-6 h-full">
               
               {/* Center Area */}
               <div className="flex-1 min-w-0 flex flex-col">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                      {activeTab === 'today' ? 'Today\'s Overview' :
                       activeTab === 'calendar' ? 'Academic Calendar' : 
                       activeTab === 'timetable' ? 'Weekly Timetable' : 'Class Manager'}
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {activeTab === 'today' ? 'Your daily schedule and ongoing events.' :
                       activeTab === 'calendar' ? 'Semester schedule, holidays, and exams.' : 
                       activeTab === 'timetable' ? 'Week-at-a-glance view of all classes.' :
                       'Customize subjects and manage class schedules.'}
                    </p>
                  </div>

                  <div className="flex-1">
                      {activeTab === 'today' && <TodayView />}
                      {activeTab === 'calendar' && <CalendarView />}
                      {activeTab === 'timetable' && <TimetableView />}
                      {activeTab === 'manager' && <ClassManager />}
                  </div>
               </div>

               {/* Right Sidebar (InfoPanel) - Desktop Only */}
               {activeTab !== 'manager' && (
                 <div className="hidden xl:block w-80 flex-shrink-0">
                    <InfoPanel />
                 </div>
               )}
            </div>
          </div>
      </main>
    </div>
  );
}

export default App;