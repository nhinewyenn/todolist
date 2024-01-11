/** @format */

import React, { createContext, ReactNode, useState } from 'react';
import { Todos } from '../constant';

type TodoContextValue = {
  todos: Todos[];
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
  editTodo: (id: string, newValue: string) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
};

type TodoContextProviderProps = {
  children: ReactNode;
};

export const TodoContext = createContext<TodoContextValue | null>(null);

export default function TodoContextProvider({
  children,
}: TodoContextProviderProps) {
  const [todos, setTodos] = useState<Todos[]>(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? (JSON.parse(storedTodos) as Todos[]) : [];
  });

  function editTodo(id: string, newValue: string) {
    const updatedTodos = todos.map((todo) => {
      if (id === todo.id) {
        return { ...todo, value: newValue };
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  function deleteTodo(id: string) {
    const updatedTodos = [...todos].filter((todo) => id !== todo.id);
    setTodos(updatedTodos);
  }

  function toggleComplete(id: string) {
    const toggleTodo = todos.find((todo) => id === todo.id);
    if (toggleTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  }

  const contextValue: TodoContextValue = {
    todos,
    setTodos,
    editTodo,
    deleteTodo,
    toggleComplete,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}
