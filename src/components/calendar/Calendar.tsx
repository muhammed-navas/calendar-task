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
        deleteTask,
        clearDragSelection
      } = useTaskContext();

      const [days, setDays] = useState(getDaysInMonth(currentMonth));
      const [isDragging, setIsDragging] = useState(false)
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingTask, setEditingTask] = useState<Task | null>(null);
      const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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
    
      const handleMouseUp = (e: React.MouseEvent) => {
        if (isDragging && dragSelection.selectedDates.length > 0) {
          setIsDragging(false);
          setIsModalOpen(true);
          e.stopPropagation();
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

      const handleTaskEdit = (task: Task) => {
        setEditingTask(task);
        // Set the drag selection to match the task's date range
        const selectedDates: Date[] = [];
        const currentDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        
        while (currentDate <= endDate) {
          selectedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Update drag selection state manually
        startDragSelection(task.startDate);
        updateDragSelection(task.endDate);
        setIsModalOpen(true);
      };

      const handleTaskDelete = (taskId: string) => {
        deleteTask(taskId);
      };

      const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.setData('text/plain', JSON.stringify({
          type: 'task',
          taskId: task.id
        }));
      };

      const handleDrop = (e: React.DragEvent, targetDate: Date) => {
        e.preventDefault();
        
        if (draggedTask) {
          // Calculate the duration of the task
          const taskDuration = Math.ceil((draggedTask.endDate.getTime() - draggedTask.startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Set new start date to the drop target
          const newStartDate = new Date(targetDate);
          const newEndDate = new Date(targetDate);
          newEndDate.setDate(newEndDate.getDate() + taskDuration);
          
          // Update the task with new dates
          updateTask(draggedTask.id, {
            startDate: newStartDate,
            endDate: newEndDate
          });
          
          setDraggedTask(null);
        }
      };

      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
      };

  return (
    <div className="h-full">
      <CalendarHeader currentMonth={currentMonth} onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth} />
      
      <CalendarGrid   
        days={days}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onTaskEdit={handleTaskEdit}
        onTaskDelete={handleTaskDelete}
        onTaskDragStart={handleTaskDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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