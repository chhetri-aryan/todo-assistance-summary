import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useTodos } from '../context/TodoContext'; // Adjust the path if needed


const TodoItem = ({ todo }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { updateTodo, deleteTodo, toggleTodoStatus } = useTodos();

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, editedTitle, editedDescription);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className={`border-l-4 rounded-md shadow-sm mb-4 p-4 ${todo.completed ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id, todo.completed)}
          className="mt-1 accent-blue-600 w-4 h-4"
        />
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.title}</h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {/* Created {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })} */}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center text-sm text-red-600 hover:underline"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Todo</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium mb-1">Title</label>
                <input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter todo title"
                />
              </div>
              <div>
                <label htmlFor="edit-desc" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="edit-desc"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter todo description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this todo?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
