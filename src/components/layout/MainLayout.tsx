import React from 'react';
import FilterSidebar from '../filters/FilterSidebar';
import Calendar from '../calendar/Calendar';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      <FilterSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;