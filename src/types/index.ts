
  
  export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    tasks: any[];
  }
  export type TaskCategory = 'To Do' | 'In Progress' | 'Review' | 'Completed';
  export interface Task {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    category: TaskCategory;
    createdAt: Date;
  }
  
  export interface DragSelection {
    isSelecting: boolean;
    startDate: Date | null;
    endDate: Date | null;
    selectedDates: Date[];
  }
  
  export interface TaskContextType {
    currentMonth: Date;
    tasks: Task[];
    setCurrentMonth: (date: Date) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    dragSelection: DragSelection;
    updateDragSelection: (date: Date) => void;
    startDragSelection: (date: Date) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    clearDragSelection: () => void;
}