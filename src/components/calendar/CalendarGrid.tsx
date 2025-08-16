import type { CalendarDay } from '../../types';
import { getWeekDays } from '../../utils/dateUtils';
import DayCell from './DayCell';

const CalendarGrid = ({days}: {days: CalendarDay[]}) => {
  const weekDays = getWeekDays();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <DayCell
            key={index}
            day={day}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;