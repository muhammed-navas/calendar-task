import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { DragSelection, Task, TaskContextType, TaskCategory, FilterState } from '../types';

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'SET_CURRENT_MONTH'; payload: Date }
  | { type: 'START_DRAG_SELECTION'; payload: Date }
  | { type: 'UPDATE_DRAG_SELECTION'; payload: Date }
  | { type: 'CLEAR_DRAG_SELECTION' }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'SET_CATEGORY_FILTER'; payload: { category: TaskCategory; checked: boolean } }
  | { type: 'SET_TIME_FILTER'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }


interface TaskState {
    tasks: Task[];
    currentMonth: Date;
    dragSelection: DragSelection;
    filters: FilterState;
}


const STORAGE_KEY = 'calendar-tasks';

const loadTasksFromStorage = (): Task[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const tasks = JSON.parse(stored);
            return tasks.map((task: any) => ({
                ...task,
                startDate: new Date(task.startDate),
                endDate: new Date(task.endDate),
                createdAt: new Date(task.createdAt)
            }));
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
    }
    return [];
};

const saveTasksToStorage = (tasks: Task[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
};

const initialState: TaskState = {
    tasks: loadTasksFromStorage(),
    currentMonth: new Date(),
    dragSelection: {
        isSelecting: false,
        startDate: null,
        endDate: null,
        selectedDates: []
    },
    filters: {
        categories: {
            'To Do': true,
            'In Progress': true,
            'Review': true,
            'Completed': true
        },
        timeRange: null,
        searchQuery: ''
    }
};

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    switch (action.type) {
        case 'LOAD_TASKS':
            return {
                ...state,
                tasks: action.payload
            };
        case 'ADD_TASK':
            const newTask: Task = {
                ...action.payload,
                id: generateId(),
                createdAt: new Date()
            };
            const newTasks = [...state.tasks, newTask];
            saveTasksToStorage(newTasks);
            return {
                ...state,
                tasks: newTasks
            };
        case 'UPDATE_TASK':
            const updatedTasks = state.tasks.map(task =>
                task.id === action.payload.id
                    ? { ...task, ...action.payload.updates }
                    : task
            );
            saveTasksToStorage(updatedTasks);
            return {
                ...state,
                tasks: updatedTasks
            };
        case 'DELETE_TASK':
            const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
            saveTasksToStorage(filteredTasks);
            return {
                ...state,
                tasks: filteredTasks
            };
        case 'START_DRAG_SELECTION':
            return {
                ...state,
                dragSelection: {
                    isSelecting: true,
                    startDate: action.payload,
                    endDate: action.payload,
                    selectedDates: [action.payload]
                }
            };
        case 'UPDATE_DRAG_SELECTION':
            if (!state.dragSelection.isSelecting || !state.dragSelection.startDate) {
                return state;
            }
            
            const startDate = state.dragSelection.startDate;
            const endDate = action.payload;
            const selectedDates: Date[] = [];
            
            // Generate all dates between start and end (inclusive)
            const currentDate = new Date(startDate);
            const lastDate = new Date(endDate);
            
            while (currentDate <= lastDate) {
                selectedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            return {
                ...state,
                dragSelection: {
                    ...state.dragSelection,
                    endDate: action.payload,
                    selectedDates
                }
            };
        case 'CLEAR_DRAG_SELECTION':
            return {
                ...state,
                dragSelection: {
                    isSelecting: false,
                    startDate: null,
                    endDate: null,
                    selectedDates: []
                }
            };
        case 'SET_CURRENT_MONTH':
            return {
                ...state,
                currentMonth: action.payload
            };
        case 'SET_CATEGORY_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    categories: {
                        ...state.filters.categories,
                        [action.payload.category]: action.payload.checked
                    }
                }
            };
        case 'SET_TIME_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    timeRange: action.payload
                }
            };
        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    searchQuery: action.payload
                }
            };
        default:
            return state;
    }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(taskReducer, initialState);

    const setCurrentMonth = (date: Date) => {
        dispatch({ type: 'SET_CURRENT_MONTH', payload: date });
    };

    const updateDragSelection = (date: Date) => {
        dispatch({ type: 'UPDATE_DRAG_SELECTION', payload: date });
    };
    const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
        dispatch({ type: 'ADD_TASK', payload: task });
    };
    const startDragSelection = (date: Date) => {
        dispatch({ type: 'START_DRAG_SELECTION', payload: date });
      };

      const updateTask = (id: string, updates: Partial<Task>) => {
        dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
      };

    const clearDragSelection = () => {
        dispatch({ type: 'CLEAR_DRAG_SELECTION' });
    };

    const deleteTask = (id: string) => {
        dispatch({ type: 'DELETE_TASK', payload: id });
    };

    const setCategoryFilter = (category: TaskCategory, checked: boolean) => {
        dispatch({ type: 'SET_CATEGORY_FILTER', payload: { category, checked } });
    };

    const setTimeFilter = (timeRange: string | null) => {
        dispatch({ type: 'SET_TIME_FILTER', payload: timeRange });
    };

    const setSearchQuery = (query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    };

    const getFilteredTasks = (): Task[] => {
        let filtered = state.tasks;

        // Filter by categories
        filtered = filtered.filter(task => state.filters.categories[task.category]);

        // Filter by search query
        if (state.filters.searchQuery.trim()) {
            const query = state.filters.searchQuery.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(query)
            );
        }

        // Filter by time range
        if (state.filters.timeRange) {
            const now = new Date();
            const weeks = parseInt(state.filters.timeRange);
            const futureDate = new Date(now.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));
            
            filtered = filtered.filter(task => 
                task.startDate >= now && task.startDate <= futureDate
            );
        }

        return filtered;
    };

    const value: TaskContextType = {
        currentMonth: state.currentMonth,
        tasks: state.tasks,
        filteredTasks: getFilteredTasks(),
        filters: state.filters,
        dragSelection: state.dragSelection,
        setCurrentMonth,
        addTask,
        updateDragSelection,
        startDragSelection,
        updateTask,
        deleteTask,
        setCategoryFilter,
        setTimeFilter,
        setSearchQuery,
        clearDragSelection
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};