import { useTaskContext } from '../../context/TaskContext';
import type { CalendarDay, Task as TaskType } from '../../types';
import { isSameDay } from '../../utils/dateUtils';
import Task from '../task/Task';

interface DayCellProps {
  day: CalendarDay;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onTaskEdit: (task: TaskType) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskDragStart: (e: React.DragEvent, task: TaskType) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const DayCell = ({
  day,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTaskEdit,
  onTaskDelete,
  onTaskDragStart,
  onDrop,
  onDragOver,
}: DayCellProps) => {

  const { dragSelection, tasks } = useTaskContext();

  const dayTasks = tasks.filter(task => {
    return isSameDay(task.startDate, day.date) || 
           (task.startDate <= day.date && task.endDate >= day.date);
  });

  const isSelected = dragSelection.selectedDates.some(date => isSameDay(date, day.date));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, day.date);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  return (
    <div
      className={`min-h-24 cursor-pointer border border-gray-200 p-1 transition-colors select-none ${
        day.isCurrentMonth 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-gray-50 text-gray-400'
      } ${
        day.isToday 
          ? 'bg-blue-50 border-blue-200' 
          : ''
      } ${
        isSelected 
          ? 'bg-blue-100 border-blue-300' 
          : ''
      }`}
      onMouseDown={() => onMouseDown(day.date)}
      onMouseEnter={() => onMouseEnter(day.date)}
      onMouseUp={(e) => onMouseUp(e)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${
          day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
        }`}>
          {day.date.getDate()}
        </span>
      </div>
      
      <div className="space-y-1">
        {dayTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            onDragStart={onTaskDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCell;