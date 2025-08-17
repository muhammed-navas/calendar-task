import type { CalendarDay, Task } from '../../types';
import { getWeekDays } from '../../utils/dateUtils';
import DayCell from './DayCell';

interface CalendarGridProps {
  days: CalendarDay[];
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const CalendarGrid = ({
  days, 
  onMouseEnter, 
  onMouseDown, 
  onMouseUp, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskDragStart, 
  onDrop, 
  onDragOver
}: CalendarGridProps) => {
  const weekDays = getWeekDays();

  return (
    <div className="bg-white  rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onTaskDragStart={onTaskDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;