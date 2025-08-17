import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, TaskCategory } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, category: TaskCategory) => void;
  task?: Task | null;
  selectedDates: Date[];
}

const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  selectedDates
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('To Do');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
    } else {
      setTitle('');
      setCategory('To Do');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), category);
      onClose();
    }
  };

  const formatDateRange = () => {
    if (selectedDates.length === 0) return '';
    if (selectedDates.length === 1) {
      return selectedDates[0].toLocaleDateString();
    }
    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const getCategoryColor = (cat: TaskCategory): string => {
    switch (cat) {
      case 'To Do':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Review':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'Completed':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {selectedDates.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border text-gray-700">
                {formatDateRange()}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter task name..."
              autoFocus
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === cat
                      ? getCategoryColor(cat)
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="absolute opacity-0"
                  />
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 cursor-pointer  text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;