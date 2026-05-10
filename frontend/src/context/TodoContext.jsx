import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; 
import { toast } from "react-toastify";
const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await api.post("/todos", { date: new Date(), title, description, completed: false });
      const newTodo = res.data?.id ? res.data : { id: res.data.id, date: new Date(), title, description, completed: false };
      setTodos(prev => [newTodo, ...prev]);
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Failed to add todo");
      console.error("Failed to add todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete todo");
      console.error("Failed to delete todo:", error);
    }
  };

  const updateTodo = async (id, title, description) => {
    try {
      await api.put(`/todos/${id}`, { title, description });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, title, description } : t));
      toast.success("Todo updated successfully!");
    } catch (error) {
      toast.error("Failed to update todo");
      console.error("Failed to update todo:", error);
    }
  };

  const toggleTodoStatus = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
      toast.success("Todo status updated successfully!");
    } catch (error) {
      toast.error("Failed to update todo status");
      console.error("Failed to toggle todo status:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const summarizeTodos = async () => {
    setIsLoading(true);
    try {
      const pendingTodos = todos.filter(todo => !todo.completed);
      const res = await api.post('/todos/summarize', { todos: pendingTodos });
      toast.success("Summary generated successfully!");
      return res.data.summary;
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error('Summarize error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendToSlack = async (summary) => {
    setIsLoading(true);
    try {
      const res = await api.post('/todos/send', { summary });
      toast.success("Summary sent to Slack successfully!");
      return res.data.success;
    } catch (error) {
      console.error('Slack send error:', error);
      toast.error("Failed to send summary to Slack");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{ todos, isLoading, addTodo, deleteTodo, summarizeTodos, sendToSlack, updateTodo, toggleTodoStatus }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
