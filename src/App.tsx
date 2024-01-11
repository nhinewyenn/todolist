/** @format */

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoInput';
import FilterButton from './components/FilterButton';
import { FILTER_MAP, FILTER_NAMES, FilterMap, Todos, uid } from './constant';
import { useTodoContext } from './hooks/useTodoContext';

export default function App() {
  const { todos, setTodos } = useTodoContext();
  const [filter, setFilter] = useState('All');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const todoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos) as Todos[];
        setTodos(parsedTodos);
      } else {
        setTodos([]); // If no stored data, initialize with an empty array
      }
    } catch (error) {
      throw new Error('Error parsing local storage data:' + error);
    }
  }, [setTodos]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos, filter]);

  function todoDesc() {
    const completedTodos = todos.filter((todo) => todo.completed).length;
    const activeTodos = todos.length - completedTodos;

    function formatTodoCount(count: number, singular: string, plural: string) {
      return `${count} ${count !== 1 ? plural : singular}`;
    }

    if (filter === 'Completed') {
      return formatTodoCount(
        completedTodos,
        'todo completed',
        'todos completed'
      );
    } else if (filter === 'All') {
      return formatTodoCount(todos.length, 'todo', 'todos');
    } else {
      return formatTodoCount(activeTodos, 'todo remaining', 'todos remaining');
    }
  }

  function handleSort() {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const _todoItems = [...todos];
      const draggedItemContent = _todoItems.splice(dragItem.current, 1)[0];
      _todoItems.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setTodos(_todoItems);
    }
  }

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

  const todoList = todos
    .filter(FILTER_MAP[filter as keyof FilterMap])
    .map((todo, index: number) => (
      <TodoCard
        {...todo}
        index={index}
        key={index}
        onDragEnd={handleSort}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => (dragOverItem.current = index)}
        onDragStart={() => (dragItem.current = index)}
      />
    ));

  return (
    <>
      <h1>TODOLIST</h1>
      <TodoForm addTodo={addTodos} todoRef={todoRef} />

      {FILTER_NAMES.map((name) => (
        <FilterButton
          name={name}
          key={name}
          isPressed={name === filter}
          setFilter={setFilter}
        />
      ))}

      {todoList.length > 0 && <h4 id='list-heading'>{todoDesc()}</h4>}
      <div className='todo-container'>
        {todoList.length > 0 && <p className='high'>High priority</p>}
        {todoList}
        {todoList.length > 0 && <p className='low'>Low priority</p>}
      </div>
    </>
  );
}
