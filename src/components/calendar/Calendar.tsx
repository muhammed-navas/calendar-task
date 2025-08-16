import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { getDaysInMonth } from '../../utils/dateUtils';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';


const Calendar: React.FC = () => {
    const {
        currentMonth,
        setCurrentMonth,
      } = useTaskContext();  
      const [days, setDays] = useState(getDaysInMonth(currentMonth));


      const handlePrevMonth = () => {
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prevMonth);
      };
    
      const handleNextMonth = () => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(nextMonth);
      };

  return (
    <div className="h-full">
      <CalendarHeader currentMonth={currentMonth} onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth} />
      
      <CalendarGrid  days={days} />
    </div>
  );
};

export default Calendar;