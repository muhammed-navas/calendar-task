import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { TaskCategory } from '../../types';

const FilterSidebar: React.FC = () => {
  const {
    filters,
    setCategoryFilter,
    setTimeFilter,
    setSearchQuery
  } = useTaskContext();
  
  const [isMinimized, setIsMinimized] = useState(false);

  const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];
  const timeRanges = [
    { value: '1', label: 'Tasks within 1 week' },
    { value: '2', label: 'Tasks within 2 weeks' },
    { value: '3', label: 'Tasks within 3 weeks' }
  ];

  const handleCategoryChange = (category: TaskCategory, checked: boolean) => {
    setCategoryFilter(category, checked);
  };

  const handleSelectAllCategories = (checked: boolean) => {
    categories.forEach(category => {
      setCategoryFilter(category, checked);
    });
  };

  const areAllCategoriesSelected = categories.every(category => filters.categories[category]);
  const areSomeCategoriesSelected = categories.some(category => filters.categories[category]);

  const handleTimeRangeChange = (value: string) => {
    setTimeFilter(filters.timeRange === value ? null : value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isMinimized) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 shadow-sm flex flex-col items-center py-4">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand filters"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
        <div className="mt-4">
          <Filter size={20} className="text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h2 className="font-semibold text-gray-800">Filters</h2>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize filters"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Search by Name</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Category Filters</h3>
          <div className="space-y-2">
            {/* Select All Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group border-b border-gray-200 pb-2 mb-2">
              <input
                type="checkbox"
                checked={areAllCategoriesSelected}
                ref={(input) => {
                  if (input) input.indeterminate = areSomeCategoriesSelected && !areAllCategoriesSelected;
                }}
                onChange={(e) => handleSelectAllCategories(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                All Categories
              </span>
            </label>
            
            {/* Individual Category Checkboxes */}
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group ml-4">
                <input
                  type="checkbox"
                  checked={filters.categories[category]}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Time-Based Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Time-Based Filters</h3>
          <div className="space-y-2">
            {timeRanges.map((range) => (
              <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="timeRange"
                  checked={filters.timeRange === range.value}
                  onChange={() => handleTimeRangeChange(range.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="timeRange"
                checked={filters.timeRange === null}
                onChange={() => setTimeFilter(null)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                All tasks
              </span>
            </label>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h3>
          <div className="space-y-1">
            {Object.entries(filters.categories).some(([_, checked]) => !checked) && (
              <div className="text-xs text-blue-600">
                Categories: {Object.entries(filters.categories)
                  .filter(([_, checked]) => checked)
                  .map(([category, _]) => category)
                  .join(', ')}
              </div>
            )}
            {filters.timeRange && (
              <div className="text-xs text-blue-600">
                Time: Within {filters.timeRange} week{filters.timeRange !== '1' ? 's' : ''}
              </div>
            )}
            {filters.searchQuery && (
              <div className="text-xs text-blue-600">
                Search: "{filters.searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;