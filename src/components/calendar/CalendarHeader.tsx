import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthName } from "../../utils/dateUtils";


const CalendarHeader = ({  currentMonth, onPrevMonth,onNextMonth}: { currentMonth: Date, onPrevMonth: () => void, onNextMonth: () => void }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
            {getMonthName(currentMonth)}
            </h1>

            <div className="flex items-center space-x-2">
                <button
                onClick={onPrevMonth}
                    className="p-2 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                 onClick={() => {
                    const today = new Date();
                    if (currentMonth.getMonth() !== today.getMonth() || currentMonth.getFullYear() !== today.getFullYear()) {
                      // This will be handled by parent to navigate to current month
                    }
                  }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Today
                </button>

                <button
                onClick={onNextMonth}
                    className="p-2 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;