import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import SummaryPanel from './components/SummaryPanel'

function App() {

  return (
    <>
     <AddTodoForm/>
     <SummaryPanel />
    </>
  )
}

export default App
