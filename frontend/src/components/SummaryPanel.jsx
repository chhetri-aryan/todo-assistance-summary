import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const SummaryPanel = () => {
  const { todos, summarizeTodos, sendToSlack, isLoading } = useTodos();
  const [summary, setSummary] = useState(null);
  const [sentToSlack, setSentToSlack] = useState(false);

  const pendingTodos = todos.filter(todo => !todo.completed);
  const hasPendingTodos = pendingTodos.length > 0;

  const handleGenerateSummary = async () => {
    const result = await summarizeTodos();
    if (result) {
      setSummary(result);
      setSentToSlack(false);
    }
  };

  const handleSendToSlack = async () => {
    if (summary) {
      const success = await sendToSlack(summary);
      setSentToSlack(success);
    }
  };

  return (
    <div className="border rounded-lg shadow-md bg-white p-6 max-w-xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Todo Summary</h2>
        <p className="text-sm text-gray-500">
          Generate a summary of your pending todos and send it to Slack
        </p>
      </div>

      {!hasPendingTodos && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-md mb-4">
          <p className="font-medium text-yellow-800">No pending todos</p>
          <p className="text-sm text-yellow-700">Add some todos to generate a summary</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading || !hasPendingTodos}
          className={`w-full px-4 py-2 rounded-md text-white font-medium transition ${
            isLoading || !hasPendingTodos
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>

        {summary && (
          <div className="mt-4 space-y-4">
            <div className="rounded-md border p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Generated Summary:</h4>
              <p className="whitespace-pre-line text-sm text-gray-700">{summary}</p>
            </div>

            <button
              onClick={handleSendToSlack}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md font-medium transition border ${
                isLoading
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'text-blue-700 border-blue-600 hover:bg-blue-50'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send to Slack'}
            </button>

            {sentToSlack && (
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-md">
                <p className="font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-700">Your summary has been sent to Slack</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPanel;
