import type { CalendarDay } from '../../types';


interface DayCellProps {
  day: CalendarDay;
}

const DayCell= ({
  day,
}:DayCellProps) => {


  return (
    <div
      className={`min-h-24 border border-gray-200 p-1 transition-colors select-none ${
        day.isCurrentMonth 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-gray-50 text-gray-400'
      } ${
        day.isToday 
          ? 'bg-blue-50 border-blue-200' 
          : ''
      }`}
     
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${
          day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
        }`}>
          {day.date.getDate()}
        </span>
      </div>
      
    </div>
  );
};

export default DayCell;