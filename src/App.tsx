/** @format */

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './components/Header';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoInput';
import FilterButton from './components/FilterButton';
import { FILTER_MAP, FILTER_NAMES, FilterMap, Todos, uid } from './constant';

function App() {
  const [todos, setTodos] = useState<Todos[]>(() => {
    return localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos') as string)
      : [];
  });
  const [filter, setFilter] = useState('All');
  const todoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setTodos(JSON.parse(localStorage.getItem('todos') as string)); // Set initial state
    } catch (error) {
      console.error('Error parsing local storage data:', error);
    }
  }, []); // Load todos from local storage on initial render

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos, filter]); // Update local storage when todos or filter change

  function addTodos(e: React.FormEvent) {
    e.preventDefault();
    const value = todoRef.current?.value;

    if (value) {
      const newTodo: Todos = {
        id: `todo-${uid()}`,
        value,
        completed: false,
      };

      setTodos((prevTodos) => {
        const newTodos = [...prevTodos, newTodo];
        localStorage.setItem('todos', JSON.stringify(newTodos));
        return newTodos;
      });
    }

    if (todoRef.current) todoRef.current.value = '';
  }

  function editTodo(id: string, newValue: string) {
    const editTodoList = todos.map((todo) => {
      //  If this have the same id as edited todo, copy the todo and update value
      if (id === todo.id) {
        return { ...todo, value: newValue };
      }
      return todo;
    });
    setTodos(editTodoList);
  }

  function deleteTodos(id: string) {
    const newTodos = [...todos].filter((todo) => id !== todo.id);
    setTodos(newTodos);
  }

  function toggleComplete(id: string) {
    // If this task have the same id as the edited task, we want to invert the completed checkbox
    const updatedTodos = todos.map((todo) => {
      if (id === todo.id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      name={name}
      key={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const todoList = todos
    .filter(FILTER_MAP[filter as keyof FilterMap])
    .map((todo) => (
      <TodoCard
        editTodo={editTodo}
        id={todo.id}
        key={todo.id}
        value={todo.value}
        completed={todo.completed}
        toggleComplete={toggleComplete}
        onDelete={deleteTodos}
      />
    ));

  function todosNoun() {
    if (todoList.length === 1) {
      return 'todo';
    } else return 'todos';
  }

  return (
    <>
      <Header />
      <TodoForm addTodo={addTodos} todoRef={todoRef} />
      {filterList}
      {todoList.length > 0 && (
        <h4 id='list-heading'>
          {todoList.length} {todosNoun()} remaining
        </h4>
      )}

      {todoList}
    </>
  );
}

export default App;
