import './App.css'
import MainLayout from './components/layout/MainLayout'
import { TaskProvider } from './context/TaskContext'

function App() {
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  )
}

export default App
