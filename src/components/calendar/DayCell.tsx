import { useTaskContext } from '../../context/TaskContext';
import type { CalendarDay } from '../../types';
import { isSameDay } from '../../utils/dateUtils';
import Task from '../task/Task';


interface DayCellProps {
  day: CalendarDay;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (e: React.MouseEvent) => void;
}

const DayCell= ({
  day,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}:DayCellProps) => {

  const { dragSelection, tasks } = useTaskContext();

  const dayTasks = tasks.filter(task => {
    return isSameDay(task.startDate, day.date) || 
           (task.startDate <= day.date && task.endDate >= day.date);
  });

  const isSelected = dragSelection.selectedDates.some(date => isSameDay(date, day.date));

  const handleTaskEdit = (task: any) => {
    // This will be handled by the parent component
  };

  const handleTaskDelete = (taskId: string) => {
    // This will be handled by the parent component
  };

  const handleTaskDragStart = (e: React.DragEvent, task: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'task',
      taskId: task.id
    }));
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
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            onDragStart={handleTaskDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCell;