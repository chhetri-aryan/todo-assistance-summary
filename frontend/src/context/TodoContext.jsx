import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; 
const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async (title, description) => {
    if (!title.trim()) return;
    try {
      await api.post("/todos", { date: new Date(), title: title, description: description, completed: false });
      setTodoText("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const updateTodo = async (id, title, description) => {
    try {
      await api.put(`/todos/${id}`, { title: title, description: description });
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  }

  const toggleTodoStatus = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error("Failed to toggle todo status:", error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const summarizeTodos = async (apiKey) => {
  try {
    const todoArray = Object.values(todos || {});
    const pendingTodos = todoArray.filter(todo => !todo.completed);
    const res = await api.post('/todos/summarize', {
      todos: pendingTodos,
      apiKey,
    });

    return res.data.summary;
  } catch (error) {
    console.error('Summarize error:', error);
    return null;
  }
};

const sendToSlack = async (summary, slackWebhook) => {
  try {
    const res = await api.post('/todos/send', {
      summary,
      slackWebhook,
    });

    return res.data.success;
  } catch (error) {
    console.error('Slack send error:', error);
    return false;
  }
};


  return (
    <TodoContext.Provider
      value={{ todos, todoText, setTodoText, addTodo, deleteTodo, summarizeTodos, sendToSlack, updateTodo, toggleTodoStatus }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
