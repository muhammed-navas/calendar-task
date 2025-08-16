import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TaskContextType } from '../types';

type TaskAction = { type: 'SET_CURRENT_MONTH'; payload: Date }

interface TaskState {
    currentMonth: Date;
}

const initialState: TaskState = {
    currentMonth: new Date(),
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    switch (action.type) {
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

    const value: TaskContextType = {
        currentMonth: state.currentMonth,
        setCurrentMonth,
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