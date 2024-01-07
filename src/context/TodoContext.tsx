/** @format */

import React, { createContext, ReactNode, useState } from 'react';
import { Todos } from '../constant';

// Define the type for the context value
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

export const TodoContext = createContext<TodoContextValue | undefined>(
  undefined
);
export default function TodoContextProvider({
  children,
}: TodoContextProviderProps) {
  const [todos, setTodos] = useState<Todos[]>(() => {
    return localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos') as string)
      : [];
  });

  function editTodo(id: string, newValue: string) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, value: newValue } : todo
    );
    setTodos(updatedTodos);
  }

  function deleteTodo(id: string) {
    const updatedTodos = [...todos].filter((todo) => id !== todo.id);
    setTodos(updatedTodos);
  }

  function toggleComplete(id: string) {
    const updatedTodos = todos.map((todo) => {
      if (id === todo.id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  const contextValue: TodoContextValue = {
    todos,
    setTodos,
    deleteTodo,
    toggleComplete,
    editTodo,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}
