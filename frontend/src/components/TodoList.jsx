import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos } = useTodos();
  const [activeTab, setActiveTab] = useState('all');

  const todoArray = Object.entries(todos || {}).map(([id, todo]) => ({
  id,
  ...todo,
}));

  const filteredTodos = todoArray.filter(todo => {
    if (activeTab === 'active') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return true;
  });

  const pendingCount = todoArray.filter(todo => !todo.completed).length;
  const completedCount = todoArray.filter(todo => todo.completed).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">My Todos</h2>

      {/* Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded text-sm font-medium border ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          All ({todoArray.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded text-sm font-medium border ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Active ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded text-sm font-medium border ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No todos found</p>
          {activeTab === 'all' && (
            <p className="mt-2 text-sm">Add your first todo to get started</p>
          )}
        </div>
      ) : (
        <div>
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
