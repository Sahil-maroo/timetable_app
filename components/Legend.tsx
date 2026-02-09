import React from 'react';

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
    <span className="text-sm text-gray-400 font-medium">{label}</span>
  </div>
);

const Legend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800 shadow-sm mt-4 justify-center sm:justify-start">
      <LegendItem color="bg-pink-500" label="Holiday" />
      <LegendItem color="bg-emerald-500" label="Classes" />
      <LegendItem color="bg-yellow-500" label="Examination" />
      <LegendItem color="bg-blue-500" label="Commencement" />
      <LegendItem color="bg-orange-500" label="Re-Exam/Event" />
      <LegendItem color="bg-violet-500" label="Assignment" />
      <LegendItem color="bg-gray-500" label="Sunday" />
    </div>
  );
};

export default Legend;