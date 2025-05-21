import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; 
import { toast } from "react-toastify";
const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      const todosArray = Object.entries(res.data).map(([id, todo]) => ({ id, ...todo }));
    setTodos(todosArray.reverse());
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
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Failed to add todo");
      console.error("Failed to add todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete todo");
      console.error("Failed to delete todo:", error);
    }
  };

  const updateTodo = async (id, title, description) => {
    try {
      await api.put(`/todos/${id}`, { title: title, description: description });
      fetchTodos();
      toast.success("Todo updated successfully!");
    } catch (error) {
      toast.error("Failed to update todo");
      console.error("Failed to update todo:", error);
    }
  }

  const toggleTodoStatus = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      fetchTodos();
      toast.success("Todo status updated successfully!");
    } catch (error) {
      toast.error("Failed to update todo status");
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

    toast.success("Summary generated successfully!");
    return res.data.summary;
  } catch (error) {
    toast.error("Failed to generate summary");
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

    toast.success("Summary sent to Slack successfully!");
    return res.data.success;
  } catch (error) {
    console.error('Slack send error:', error);
    toast.error("Failed to send summary to Slack");
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
