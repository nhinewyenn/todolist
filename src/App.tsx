/** @format */

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoInput';
import FilterButton from './components/FilterButton';
import { FILTER_MAP, FILTER_NAMES, FilterMap, Todos, uid } from './constant';
import { useTodoContext } from './hooks/useTodoContext';

function App() {
  const { todos, setTodos } = useTodoContext();
  const [filter, setFilter] = useState('All');
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  const todoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setTodos(JSON.parse(localStorage.getItem('todos') as string));
    } catch (error) {
      throw new Error('Error parsing local storage data:' + error);
    }
  }, [setTodos]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos, filter]);

  function handleSort() {
    const _todoItems = [...todos];
    const draggedItemContent = _todoItems.splice(dragItem.current, 1)[0];
    _todoItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(_todoItems);
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
    .map((todo, index) => (
      <TodoCard
        index={index}
        id={todo.id}
        key={index}
        onDragEnd={handleSort}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => (dragOverItem.current = index)}
        onDragStart={() => (dragItem.current = index)}
        value={todo.value}
        completed={todo.completed}
      />
    ));

  function todosNoun() {
    return todoList.length === 1 ? 'todo' : 'todos';
  }

  return (
    <>
      <h1>TODOLIST</h1>
      <TodoForm addTodo={addTodos} todoRef={todoRef} />
      {filterList}
      {todoList.length > 0 && (
        <h4 id='list-heading'>
          {todoList.length} {todosNoun()} remaining
        </h4>
      )}
      <div className='todo-container'>
        <p className='high'>High priority</p>
        {todoList}
        <p className='low'>Low priority</p>
      </div>
    </>
  );
}

export default App;
