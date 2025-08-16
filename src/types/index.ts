
  
  export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    tasks: any[];
  }
  
  
  export interface TaskContextType {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
  }