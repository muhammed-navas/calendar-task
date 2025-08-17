import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { DragSelection, Task, TaskContextType } from '../types';

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'SET_CURRENT_MONTH'; payload: Date }
  | { type: 'START_DRAG_SELECTION'; payload: Date }
  | { type: 'UPDATE_DRAG_SELECTION'; payload: Date }
  | { type: 'CLEAR_DRAG_SELECTION' }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }


interface TaskState {
    tasks: Task[];
    currentMonth: Date;
    dragSelection: DragSelection;
}


const initialState: TaskState = {
    tasks: [],
    currentMonth: new Date(),
    dragSelection: {
        isSelecting: false,
        startDate: null,
        endDate: null,
        selectedDates: []
    }
};

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    switch (action.type) {
        case 'ADD_TASK':
            const newTask: Task = {
                ...action.payload,
                id: generateId(),
                createdAt: new Date()
            };
            return {
                ...state,
                tasks: [...state.tasks, newTask]
            };
            case 'UPDATE_TASK':
                return {
                  ...state,
                  tasks: state.tasks.map(task =>
                    task.id === action.payload.id
                      ? { ...task, ...action.payload.updates }
                      : task
                  )
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

    const value: TaskContextType = {
        currentMonth: state.currentMonth,
        tasks: state.tasks,
        dragSelection: state.dragSelection,
        setCurrentMonth,
        addTask,
        updateDragSelection,
        startDragSelection,
        updateTask,
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