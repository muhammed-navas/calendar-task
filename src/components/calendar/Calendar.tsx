import { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { getDaysInMonth } from '../../utils/dateUtils';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import TaskModal from '../task/TaskModal';
import type { Task, TaskCategory } from '../../types';


const Calendar: React.FC = () => {
    const {
        currentMonth,
        setCurrentMonth,
        dragSelection,
        updateDragSelection,
        startDragSelection,
        updateTask,
        addTask,
        clearDragSelection
      } = useTaskContext();

      const [days, setDays] = useState(getDaysInMonth(currentMonth));
      const [isDragging, setIsDragging] = useState(false)
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingTask, setEditingTask] = useState<Task | null>(null);

      useEffect(() => {
        setDays(getDaysInMonth(currentMonth));
      }, [currentMonth]);


      const handlePrevMonth = () => {
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prevMonth);
      };

      const handleNextMonth = () => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(nextMonth);
      };

      const handleMouseDown = (date: Date) => {
        if (!isDragging) {
          setIsDragging(true);
          startDragSelection(date);
        }
      };
    
      const handleMouseEnter = (date: Date) => {
        if (isDragging && dragSelection.isSelecting) {
          updateDragSelection(date);
        }
      };
    
      const handleMouseUp = (e:any) => {
        if (isDragging && dragSelection.selectedDates.length > 0) {
          setIsDragging(false);
          setIsModalOpen(true);
          e.stopePropagation()
        } else {
          setIsDragging(false);
          clearDragSelection();
        }
      };

      const handleModalSave = (title: string, category: TaskCategory) => {
        if (dragSelection.selectedDates.length > 0) {
          const startDate = dragSelection.selectedDates[0];
          const endDate = dragSelection.selectedDates[dragSelection.selectedDates.length - 1];
          
          if (editingTask) {
            updateTask(editingTask.id, {
              title,
              category,
              startDate,
              endDate
            });
          } else {
            addTask({
              title,
              category,
              startDate,
              endDate
            });
          }
        }
        
        clearDragSelection();
        setEditingTask(null);
        setIsModalOpen(false);
      };
    
      const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        clearDragSelection();
      };

  return (
    <div className="h-full">
      <CalendarHeader currentMonth={currentMonth} onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth} />
      
      <CalendarGrid   days={days}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
         />

<TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        task={editingTask}
        selectedDates={dragSelection.selectedDates}
      />

    </div>
  );
};

export default Calendar;