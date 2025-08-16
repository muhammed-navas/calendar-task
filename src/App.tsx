import './App.css'
import Calendar from './components/calendar/Calendar'
import { TaskProvider } from './context/TaskContext'

function App() {

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen">
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <Calendar />
              </div>
            </div>
          </div>
        </div>
    </TaskProvider>
  )
}

export default App
