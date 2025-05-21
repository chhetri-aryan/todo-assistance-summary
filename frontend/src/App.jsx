import './App.css'
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import SummaryPanel from './components/SummaryPanel'

function App() {

  return (
    <div className="">
      <div className='text-5xl font-bold mb-4 text-white'>Todo Summary Assistance</div>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <AddTodoForm />
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <TodoList />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 h-fit">
          <SummaryPanel />
        </div>
      </div>
    </div>
  );
}

export default App
