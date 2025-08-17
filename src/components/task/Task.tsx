import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Task as TaskType, TaskCategory } from '../../types';

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: TaskType) => void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete, onDragStart }) => {
  const [showActions, setShowActions] = useState(false);

  const getCategoryColor = (category: TaskCategory): string => {
    switch (category) {
      case 'To Do':
        return 'bg-blue-500 border-blue-600';
      case 'In Progress':
        return 'bg-yellow-500 border-yellow-600';
      case 'Review':
        return 'bg-purple-500 border-purple-600';
      case 'Completed':
        return 'bg-green-500 border-green-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
    setShowActions(false);
  };

  return (
    <div
      className={`relative px-3 py-2 rounded-md text-white text-sm cursor-move select-none shadow-sm hover:shadow-md transition-all ${getCategoryColor(task.category)}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onMouseLeave={() => setShowActions(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium truncate flex-1 pr-2">{task.title}</span>
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded cursor-pointer bg-blue-700 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-32">
              <button
                onClick={handleEdit}
                className="flex items-center cursor-pointer w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Edit2 size={14} className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center cursor-pointer w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs opacity-90 mt-1">
        {task.category}
      </div>
    </div>
  );
};

export default Task;